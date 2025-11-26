
import React, { useState } from 'react';
import type { CommunityPost } from '../types';
import { HeartIcon, PencilIcon, XMarkIcon } from './Icons';

interface CommunityTabProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'createdAt'>) => void;
  onLikePost: (id: string) => void;
}

const CommunityTab: React.FC<CommunityTabProps> = ({ posts, onAddPost, onLikePost }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', type: 'recipe' as 'recipe' | 'pairing', author: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      onAddPost({
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
        author: newPost.author || '익명의 미식가',
      });
      setNewPost({ title: '', content: '', type: 'recipe', author: '' });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 space-y-8 animate-fade-in relative">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-light">커뮤니티</h2>
        <p className="text-neutral-500 mt-1">당신의 특별한 레시피와 페어링을 공유하세요.</p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${post.type === 'recipe' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                  {post.type === 'recipe' ? '나만의 레시피' : '꿀조합 페어링'}
                </span>
                <h3 className="text-xl font-bold text-neutral-900">{post.title}</h3>
              </div>
              <button 
                onClick={() => onLikePost(post.id)}
                className="flex items-center gap-1 text-neutral-400 hover:text-red-500 transition-colors group"
              >
                <HeartIcon className="w-6 h-6 group-hover:fill-red-500" />
                <span className="text-sm">{post.likes}</span>
              </button>
            </div>
            <p className="text-neutral-700 mb-4 whitespace-pre-wrap">{post.content}</p>
            <div className="text-xs text-neutral-400 flex justify-between">
              <span>by {post.author}</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-xl hover:bg-neutral-800 transition-colors z-20 flex items-center gap-2"
      >
        <PencilIcon className="w-6 h-6" />
        <span className="font-bold pr-1 hidden md:inline">글쓰기</span>
      </button>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold mb-6">새로운 글 작성하기</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">카테고리</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={newPost.type === 'recipe'} 
                      onChange={() => setNewPost({...newPost, type: 'recipe'})}
                      className="accent-black"
                    />
                    <span className="text-sm">레시피</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={newPost.type === 'pairing'} 
                      onChange={() => setNewPost({...newPost, type: 'pairing'})}
                      className="accent-black"
                    />
                    <span className="text-sm">페어링</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">제목</label>
                <input 
                  type="text" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">작성자 (선택)</label>
                <input 
                  type="text" 
                  value={newPost.author}
                  onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="닉네임"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">내용</label>
                <textarea 
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-32 resize-none"
                  placeholder="나만의 레시피나 페어링 팁을 공유해주세요."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-neutral-800 transition-colors mt-2"
              >
                공유하기
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityTab;
