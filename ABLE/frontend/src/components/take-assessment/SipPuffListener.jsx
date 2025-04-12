// SipPuffListener.jsx
import { useEffect } from "react";

export default function SipPuffListener({ onSip, onPuff }) {
  useEffect(() => {
    const connectSerial = async () => {
      if (!("serial" in navigator)) {
        console.error("❌ Serial API not supported in this browser.");
        return;
      }

      try {
        const port = await navigator.serial.requestPort(); // triggers permission prompt
        await port.open({ baudRate: 9600 });

        console.log("✅ Serial port opened");

        const decoder = new TextDecoderStream();
        const inputDone = port.readable.pipeTo(decoder.writable);
        const inputStream = decoder.readable;
        const reader = inputStream.getReader();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!value) continue;

          const line = value.trim().toLowerCase();
          if (line.includes("sip")) {
            console.log("🫧 Sip detected!");
            onSip();
          } else if (line.includes("puff")) {
            console.log("💨 Puff detected!");
            onPuff();
          }
        }

        reader.releaseLock();
      } catch (err) {
        console.error("❌ Serial Error:", err);
      }
    };

    connectSerial();
  }, [onSip, onPuff]);

  return null; // This component runs in background
}
