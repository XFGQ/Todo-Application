import { useState } from 'react';

export default function TodoAdd({ onAdd, existingTags }) {
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState('General');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;

    const finalTag = isAddingNew ? (newTag.trim() || 'General') : (selectedTag || 'General');

    onAdd(text, finalTag);
    setText('');
    setNewTag('');
    setIsAddingNew(false);
    setSelectedTag('General');
  };

  const handleTagChange = (e) => {
    if (e.target.value === 'ADD_NEW') {
      setIsAddingNew(true);
      setSelectedTag('');
    } else {
      setIsAddingNew(false);
      setSelectedTag(e.target.value);
    }
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
        
        {!isAddingNew ? (
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="w-1/3 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white"
          >
            <option value="General">General</option>
            {existingTags.filter(t => t !== 'General').map((t, index) => (
              <option key={index} value={t}>{t}</option>
            ))}
            <option value="ADD_NEW" className="font-bold text-blue-600">+ Add New Tag</option>
          </select>
        ) : (
          <div className="flex w-1/3 gap-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setSelectedTag('General');
              }}
              className="bg-gray-200 text-gray-600 px-3 rounded-lg hover:bg-gray-300 font-bold"
            >
              X
            </button>
          </div>
        )}
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