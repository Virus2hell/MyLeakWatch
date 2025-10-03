// import React from 'react';

// type Props = { role: 'user' | 'assistant'; text: string };

// export default function ChatMessage({ role, text }: Props) {
//   const side = role === 'user' ? 'items-end' : 'items-start';
//   const bubble =
//     role === 'user'
//       ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
//       : 'bg-slate-900/70 border border-white/10 text-slate-100 rounded-r-2xl rounded-tl-2xl';
//   return (
//     <div className={`w-full flex ${side}`}>
//       <div className={`max-w-[85%] px-3 py-2 text-sm leading-snug ${bubble}`}>
//         {text}
//       </div>
//     </div>
//   );
// }

import React from 'react';

type Props = { role: 'user' | 'assistant'; text: string };

export default function ChatMessage({ role, text }: Props) {
  const side = role === 'user' ? 'items-end' : 'items-start';
  const bubble =
    role === 'user'
      ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
      : 'bg-slate-900/70 border border-white/10 text-slate-100 rounded-r-2xl rounded-tl-2xl';
  return (
    <div className={`w-full flex ${side}`}>
      <div className={`max-w-[85%] px-3 py-2 text-sm leading-snug ${bubble}`}>
        {text}
      </div>
    </div>
  );
}

