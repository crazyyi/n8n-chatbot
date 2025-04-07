"use client"

import React, { useRef, useActionState, useEffect } from 'react';
import useStore from './store';

interface FormState {
  response: string;
}

async function submitForm(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const message = (formData.get('message') as string).trim();
  if (!message) {
    return { response: 'Please enter a message.' };
  }

  try {
    const res = await fetch('https://playbot.app.n8n.cloud/webhook/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-api-key": process.env.NEXT_PUBLIC_SECRET_KEY!
        // "x-api-key": "wrong_secret_key" // for testing
      },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      // For error responses, just get the text
      const errorText = await res.text();
      return { response: `API Error: ${errorText || `${res.status} ${res.statusText}`}` };
    }

    const data = await res.json();
    return { response: data.output || JSON.stringify(data) };
  } catch (err) {
    console.error(err);
    let errorMessage = 'Unknown error occurred';
    if (err && typeof err === 'object') {
      if ('message' in err) {
        errorMessage = String(err.message);
      } else {
        errorMessage = String(err);
      }
    } else if (err !== null && err !== undefined) {
      errorMessage = String(err);
    }

    return { response: `Error: ${errorMessage}` };
  }
}

const AIChatBot = () => {
  const { responses, addResponse } = useStore()
  const [state, dispatch, isPending] = useActionState(submitForm, { response: '' });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.response) {
      addResponse(state.response); // Append new response to the accumulated string
    }
  }, [state.response, addResponse]);

  return (
    <div className='h-full w-full space-y-6'>
      <h2 className='font-bold text-3xl'>Customer support chatbot for SurfAuto</h2>
      <form action={dispatch} ref={formRef} className='flex flex-col items-end space-y-5'>
        <textarea className='w-full h-36 p-2 font-semibold focus:bg-blue-100 border' name="message" id="message" placeholder='Your Message...' disabled={isPending}></textarea>
        <button className='w-48 h-16 border rounded-sm bg-zinc-200 hover:bg-zinc-300 hover:cursor-pointer' type="submit" disabled={isPending}>{isPending ? (
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
        ) : (
          'Send'
        )}</button>
      </form>
      <label className="font-bold">Response:</label>
      <div className="my-1 p-2 bg-zinc-300 h-72 font-semibold" id="chat-response">
        <ol>
          {responses.map((value, index) => {
            return (
              <li key={index}>{value}</li>
            )
          })}
        </ol>
      </div>
    </div>
  );
}

export default AIChatBot;