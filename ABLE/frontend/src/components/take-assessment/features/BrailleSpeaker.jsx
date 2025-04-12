// features/BrailleSpeaker.jsx

import React, { useEffect, useRef, useState } from "react";

const letterToDots = {
  a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5],
  f: [1, 2, 4], g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5],
  k: [1, 3], l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5],
  p: [1, 2, 3, 4], q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4],
  t: [2, 3, 4, 5], u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6],
  x: [1, 3, 4, 6], y: [1, 3, 4, 5, 6], z: [1, 3, 5, 6],
  " ": [], "1": [1], "2": [1, 2], "3": [1, 4], "4": [1, 4, 5],
  "5": [1, 5], "6": [1, 2, 4], "7": [1, 2, 4, 5], "8": [1, 2, 5],
  "9": [2, 4], "0": [2, 4, 5]
};

export default function BrailleSpeaker({ question, options }) {
  const portRef = useRef(null);
  const writerRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // 1) Prompt for and open the port once
  useEffect(() => {
    async function initSerial() {
      try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        portRef.current = port;
        writerRef.current = port.writable.getWriter();
        setConnected(true);
      } catch (err) {
        console.error("❌ WebSerial open error:", err);
      }
    }
    initSerial();

    return () => {
      // cleanup
      (async () => {
        if (writerRef.current) {
          await writerRef.current.releaseLock();
          writerRef.current = null;
        }
        if (portRef.current) {
          await portRef.current.close();
          portRef.current = null;
        }
      })();
    };
  }, []);

  // 2) Whenever we are connected *and* question/options change, send them
  useEffect(() => {
    if (!connected) return;

    async function sendAll() {
      const writer = writerRef.current;
      if (!writer) return;

      // helper to buzz + strobe one char
      async function buzzAndStrobe(char) {
        const dots = letterToDots[char] || [];
        // buzz command
        await writer.write(new Uint8Array([0xFF, 200]));
        await new Promise((r) => setTimeout(r, 250));
        // braille dots packet
        const packet = new Uint8Array([dots.length, ...dots]);
        await writer.write(packet);
        await new Promise((r) => setTimeout(r, 300));
      }

      // 2a) Question text
      for (let ch of question.toLowerCase()) {
        await buzzAndStrobe(ch);
      }
      await new Promise((r) => setTimeout(r, 1000));

      // 2b) Options (label + text)
      const labels = ["a", "b", "c", "d"];
      for (let i = 0; i < options.length; i++) {
        for (let ch of labels[i]) {
          await buzzAndStrobe(ch);
        }
        await new Promise((r) => setTimeout(r, 300));
        for (let ch of options[i].toLowerCase()) {
          await buzzAndStrobe(ch);
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    sendAll();
  }, [connected, question, options]);

  return null;
}
