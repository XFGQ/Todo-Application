import { useState } from 'react';

export default function TodoAdd({ onAdd }) {
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onAdd(text, tag.trim() || 'General');
    setText('');
    setTag('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task description..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
        />
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Tag (Work, Personal...)"
          className="w-1/3 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold"
      >
        Add Task
      </button>
    </form>
  );
}