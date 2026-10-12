
export type Lang = 'ar' | 'en';

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;
let requestController: AbortController | null = null;

export const ttsSupported = () =>
  typeof window !== 'undefined' &&
  typeof window.fetch === 'function' &&
  typeof window.Audio === 'function';

export async function speak(
  text: string,
  lang: Lang = 'ar',
  rate = 0.9,
): Promise<void> {
  if (!ttsSupported() || !text.trim()) return;

  stopSpeaking();

  const controller = new AbortController();
  requestController = controller;

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.trim(),
        lang,
        rate,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.error || 'تعذر إنشاء الصوت');
    }

    const audioBlob = await response.blob();

    if (controller.signal.aborted) return;

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    currentAudioUrl = audioUrl;
    currentAudio = audio;
    audio.playbackRate = Math.min(1.5, Math.max(0.7, rate));

    audio.onended = () => {
      if (currentAudio === audio) {
        URL.revokeObjectURL(audioUrl);
        currentAudioUrl = null;
        currentAudio = null;
      }
    };

    audio.onerror = () => {
      if (currentAudio === audio) {
        URL.revokeObjectURL(audioUrl);
        currentAudioUrl = null;
        currentAudio = null;
      }
    };

    await audio.play();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;

    console.error('TTS error:', error);
    alert(
      error instanceof Error
        ? error.message
        : 'حصل خطأ أثناء تشغيل الصوت. حاول مرة أخرى.',
    );
  } finally {
    if (requestController === controller) {
      requestController = null;
    }
  }
}

export function stopSpeaking() {
  requestController?.abort();
  requestController = null;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
    currentAudioUrl = null;
  }
}
