// Change this to your Flask/FastAPI backend URL when running locally in VSCode
const API_ENDPOINT = "http://localhost:5000/process";

export async function processImage(file: File): Promise<{ clean: string; particles: string }> {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    // Expects: { clean: "base64 or URL", particles: "base64 or URL" }
    return data;
  } catch (error) {
    // Simulated fallback — remove this block once your backend is running
    console.warn("Backend not available, using simulated delay. Error:", error);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Return the original image as placeholder for both panels
    const base64 = await fileToBase64(file);
    return { clean: base64, particles: base64 };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
