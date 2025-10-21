/**
 * 文章交互组件
 * 包含点赞、评论、分享等功能
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/classNames';
import { blogService, type BlogComment, type BlogCommentRequest } from '@/services/blogService';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';

export interface ArticleInteractionsProps {
  slug: string;
  likeCount?: number;
  commentCount?: number;
  className?: string;
  onLike?: (liked: boolean) => void;
  onComment?: (comment: BlogComment) => void;
}

export const ArticleInteractions: React.FC<ArticleInteractionsProps> = ({
  slug,
  likeCount = 0,
  commentCount = 0,
  className,
  onLike,
  onComment
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState<BlogCommentRequest>({
    content: '',
    author: '',
    email: ''
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 加载评论
  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await blogService.getComments(slug);
      if (response.success && response.data) {
        setComments(response.data);
      }
    } catch (error) {
      // Error handling for production
    } finally {
      setIsLoadingComments(false);
    }
  };

  // 处理点赞
  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await blogService.likeArticle(slug);
      if (response.success) {
        const newLiked = !isLiked;
        setIsLiked(newLiked);
        setCurrentLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
        
        // 记录分析事件
        const base = buildBaseContext();
        trackEvent({
          eventType: 'article_like',
          ...base,
          data: { 
            articleSlug: slug,
            liked: newLiked,
            likeCount: currentLikeCount + (newLiked ? 1 : -1)
          },
        });
        
        onLike?.(newLiked);
      }
    } catch (error) {
      // Error handling for production
    } finally {
      setIsLiking(false);
    }
  };

  // 处理评论提交
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim() || !newComment.author.trim() || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    try {
      const response = await blogService.addComment(slug, newComment);
      if (response.success && response.data) {
        setComments(prev => [response.data!, ...prev]);
        setNewComment({ content: '', author: '', email: '' });
        
        // 记录分析事件
        const base = buildBaseContext();
        trackEvent({
          eventType: 'article_comment',
          ...base,
          data: { 
            articleSlug: slug,
            commentId: response.data.id
          },
        });
        
        onComment?.(response.data);
      }
    } catch (error) {
      // Error handling for production
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 切换评论显示
  const toggleComments = () => {
    if (!showComments) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* 交互按钮 */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            isLiked 
              ? "bg-red-100 text-red-600 hover:bg-red-200" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            isLiking && "opacity-50 cursor-not-allowed"
          )}
        >
          <svg 
            className={cn("w-5 h-5", isLiked && "fill-current")} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{currentLikeCount}</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{commentCount}</span>
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: document.title,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              // 可以添加toast提示
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {/* 评论区域 */}
      {showComments && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
          
          {/* 添加评论表单 */}
          <form onSubmit={handleCommentSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newComment.author}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={newComment.email}
                  onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment *
                </label>
                <textarea
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.content.trim() || !newComment.author.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* 评论列表 */}
          {isLoadingComments ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleInteractions;
