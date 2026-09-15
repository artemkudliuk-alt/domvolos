import { GoogleGenAI } from "@google/genai";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { getWigById } from "@/lib/wigs";

export const runtime = "nodejs";

const GEMINI_MODEL = "gemini-3.1-flash-image-preview";
const DEFAULT_GPT_IMAGE_MODEL = process.env.GPT_IMAGE_MODEL || "gpt-image-2";

const UNIVERSAL_PROMPT_FILE = path.join(process.cwd(), "universal-prompt.txt");
const WATERMARK_LOGO_FILE = path.join(process.cwd(), "public", "logo", "dom-volos.png");

const WIG_2_PROMPT_OVERRIDE = `CRITICAL OVERRIDE FOR THIS WIG:
The left image is the immutable source photo of the real person and must remain the same person.
The right image is only a hairstyle reference.
Do not generate a new woman.
Do not change face identity.
Do not change ethnicity.
Do not change eye shape, nose, lips, jawline, cheek structure, skin tone, makeup, expression, or age.
Do not change background, camera angle, framing, pose, clothing, jewelry, or lighting.
Edit only the hair region on the left person.
Keep the exact same original selfie and replace only the hair with the hairstyle design from the reference image on the right.
The output must look like the same exact uploaded selfie with different hair only.`;

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          data?: string;
          mimeType?: string;
        };
      }>;
    };
  }>;
};

function getMimeType(filePathOrUrl: string) {
  const extension = path.extname(filePathOrUrl.split("?")[0]).toLowerCase();

  switch (extension) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".jpg":
    case ".jpeg":
    default:
      return "image/jpeg";
  }
}

function getOutputMimeType(mimeType: string) {
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return "image/jpeg";
  }

  if (mimeType === "image/webp") {
    return "image/webp";
  }

  return "image/png";
}

async function readUniversalPrompt() {
  return (await readFile(UNIVERSAL_PROMPT_FILE, "utf8")).trim();
}

async function loadWigImageAsBuffer(imageSrc: string): Promise<{ buffer: Buffer; mimeType: string }> {
  if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
    const res = await fetch(imageSrc);
    if (!res.ok) {
      throw new Error(`Не удалось загрузить фото парика по ссылке: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || getMimeType(imageSrc);
    return {
      buffer: Buffer.from(arrayBuffer),
      mimeType: contentType
    };
  } else {
    const localPath = path.join(process.cwd(), "public", imageSrc.replace(/^\//, ""));
    const fileBuffer = await readFile(localPath);
    return {
      buffer: fileBuffer,
      mimeType: getMimeType(localPath)
    };
  }
}

async function addWatermarkToImage(imageData: string, mimeType: string) {
  const imageBuffer = Buffer.from(imageData, "base64");
  const [logoBuffer, imageMetadata] = await Promise.all([
    readFile(WATERMARK_LOGO_FILE),
    sharp(imageBuffer).metadata()
  ]);

  const imageWidth = imageMetadata.width ?? 768;
  const imageHeight = imageMetadata.height ?? 1024;
  const logoWidth = Math.max(150, Math.min(Math.round(imageWidth * 0.22), 240));

  const resizedLogo = await sharp(logoBuffer)
    .resize({ width: logoWidth, withoutEnlargement: true })
    .png()
    .toBuffer();

  const logoMetadata = await sharp(resizedLogo).metadata();
  const logoHeight = logoMetadata.height ?? Math.round(logoWidth * (60 / 320));
  const marginY = Math.max(28, Math.round(imageHeight * 0.04));

  // Position logo strictly at bottom center
  const left = Math.max(0, Math.round((imageWidth - logoWidth) / 2));
  const top = Math.max(imageHeight - logoHeight - marginY, marginY);

  let pipeline = sharp(imageBuffer).composite([
    {
      input: resizedLogo,
      left,
      top
    }
  ]);

  const outputMimeType = getOutputMimeType(mimeType);

  if (outputMimeType === "image/jpeg") {
    pipeline = pipeline.jpeg({ quality: 96 });
  } else if (outputMimeType === "image/webp") {
    pipeline = pipeline.webp({ quality: 96 });
  } else {
    pipeline = pipeline.png();
  }

  const watermarkedBuffer = await pipeline.toBuffer();

  return {
    data: watermarkedBuffer.toString("base64"),
    mimeType: outputMimeType
  };
}

function buildFinalPrompt(universalPrompt: string, wigId: string, wigName: string) {
  const promptParts = [universalPrompt, `Selected wig: ${wigName}.`];

  if (wigId === "wig-2") {
    promptParts.push(WIG_2_PROMPT_OVERRIDE);
  }

  return promptParts.join("\n\n");
}

function extractGeneratedImage(response: GeminiGenerateResponse) {
  const candidates = response.candidates ?? [];

  for (const candidate of candidates) {
    const parts = candidate.content?.parts ?? [];

    for (const part of parts) {
      if (part.inlineData?.data) {
        return {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType ?? "image/png"
        };
      }
    }
  }

  return null;
}

async function generateWithOpenAI({
  apiKey,
  model,
  prompt,
  wigName,
  selfieBuffer,
  wigBuffer,
}: {
  apiKey: string;
  model: string;
  prompt: string;
  wigName: string;
  selfieBuffer: Buffer;
  wigBuffer: Buffer;
}): Promise<{ base64: string; mimeType: string }> {
  // Auto-orient (iPhone stores sensor-landscape pixels plus an EXIF orientation tag)
  // and cap the long edge so a 12MP photo stays well under the 50MB per-image API limit.
  const selfiePng = await sharp(selfieBuffer)
    .rotate()
    .resize({ width: 1024, height: 1536, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();

  const wigPng = await sharp(wigBuffer)
    .rotate()
    .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();

  const fullInstruction = `The first image is the target selfie of a woman. The second image is a reference photo of the wig "${wigName}" on a mannequin.
Edit the first image only: replace the woman's hair with the hairstyle, hair color, texture, volume, and cut line of the wig from the second image.
Fit the hairstyle naturally to her head shape, centred and symmetrical, and keep the whole hairstyle including the crown and any volume inside the frame without cutting off.
Do not copy the mannequin, its stand, or the second image's background into the result.
Keep her face, eyes, nose, lips, expression, skin tone, clothing, posture, framing, and background 100% identical and unchanged.
${prompt}`;

  const formData = new FormData();
  formData.append("model", model);
  formData.append("image[]", new Blob([new Uint8Array(selfiePng)], { type: "image/png" }), "selfie.png");
  formData.append("image[]", new Blob([new Uint8Array(wigPng)], { type: "image/png" }), "wig-reference.png");
  formData.append("prompt", fullInstruction);
  formData.append("size", "1024x1536");

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `OpenAI Edits API status ${res.status}`);
  }

  const data = await res.json();
  const item = data.data?.[0];
  let rawB64 = item?.b64_json;

  if (!rawB64 && item?.url) {
    const imgFetch = await fetch(item.url);
    const arrayBuf = await imgFetch.arrayBuffer();
    rawB64 = Buffer.from(arrayBuf).toString("base64");
  }

  if (!rawB64) {
    throw new Error("OpenAI API не вернул изображение.");
  }

  return { base64: rawB64, mimeType: "image/png" };
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const wigId = formData.get("wigId");
  const selfie = formData.get("selfie");
  const reqWigImageSrc = formData.get("wigImageSrc");
  const reqWigName = formData.get("wigName");

  if (typeof wigId !== "string") {
    return NextResponse.json(
      { success: false, error: "Не выбран парик." },
      { status: 400 }
    );
  }

  if (!(selfie instanceof File) || selfie.size === 0) {
    return NextResponse.json(
      { success: false, error: "Не загружено фото." },
      { status: 400 }
    );
  }

  const staticWig = getWigById(wigId);
  const wigName = typeof reqWigName === "string" && reqWigName ? reqWigName : staticWig?.name ?? `Wig ${wigId}`;
  const wigImageSrc = typeof reqWigImageSrc === "string" && reqWigImageSrc ? reqWigImageSrc : staticWig?.imageSrc;

  if (!wigImageSrc) {
    return NextResponse.json(
      { success: false, error: "Выбранный парик не найден." },
      { status: 404 }
    );
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!openaiApiKey && !geminiApiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Не найден API ключ (OPENAI_API_KEY или GEMINI_API_KEY). Добавьте ключ в файл .env.local."
      },
      { status: 500 }
    );
  }

  try {
    const universalPrompt = await readUniversalPrompt();
    const finalPrompt = buildFinalPrompt(universalPrompt, wigId, wigName);

    const selfieArrayBuffer = await selfie.arrayBuffer();
    const rawSelfieBuffer = Buffer.from(selfieArrayBuffer);
    const selfieBuffer = await sharp(rawSelfieBuffer).rotate().toBuffer();

    const wigImageData = await loadWigImageAsBuffer(wigImageSrc);

    let generatedImageData: { data: string; mimeType: string };

    // Use OpenAI gpt-image-2 with side-by-side composite
    if (openaiApiKey && openaiApiKey.trim() !== "") {
      const gptResult = await generateWithOpenAI({
        apiKey: openaiApiKey.trim(),
        model: DEFAULT_GPT_IMAGE_MODEL,
        prompt: finalPrompt,
        wigName,
        selfieBuffer,
        wigBuffer: wigImageData.buffer
      });
      generatedImageData = {
        data: gptResult.base64,
        mimeType: gptResult.mimeType
      };
    } else {
      // Otherwise use Gemini API
      const selfieBase64 = selfieBuffer.toString("base64");
      const wigBase64 = wigImageData.buffer.toString("base64");

      const ai = new GoogleGenAI({ apiKey: geminiApiKey! });
      const response = (await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          { text: finalPrompt },
          {
            inlineData: {
              mimeType: selfie.type || "image/jpeg",
              data: selfieBase64
            }
          },
          {
            inlineData: {
              mimeType: wigImageData.mimeType,
              data: wigBase64
            }
          }
        ],
        config: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      })) as GeminiGenerateResponse;

      const extracted = extractGeneratedImage(response);
      if (!extracted) {
        throw new Error("Gemini не вернул изображение для результата.");
      }
      generatedImageData = extracted;
    }

    const watermarkedImage = await addWatermarkToImage(
      generatedImageData.data,
      generatedImageData.mimeType
    );

    return NextResponse.json({
      success: true,
      mode: "live",
      generatedImageUrl: `data:${watermarkedImage.mimeType};base64,${watermarkedImage.data}`,
      message: `Примерка готова для варианта «${wigName}».`
    });
  } catch (error) {
    console.error("Generate error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? `Не удалось получить ответ: ${error.message}`
            : "Не удалось выполнить примерку."
      },
      { status: 502 }
    );
  }
}