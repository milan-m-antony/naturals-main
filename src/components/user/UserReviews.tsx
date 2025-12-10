import React, { useState, useEffect } from 'react';
import { Star, Search, Filter, MessageSquare, ThumbsUp } from 'lucide-react';

interface ServiceReview {
  id: number;
  service_id: number;
  user_id: number;
  service_name?: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

interface UserReviewsProps {
  showToast: (msg: string, type?: 'success' | 'loading') => void;
}

const UserReviews: React.FC<UserReviewsProps> = ({ showToast }) => {
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'rating-high' | 'rating-low'>('recent');

  useEffect(() => {
    loadMyReviews();
  }, []);

  const loadMyReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/my-reviews`,
        {
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      showToast('Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews
    .filter(review =>
      review.service_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'rating-high') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[600px] space-y-6">
      <div className="px-1">
        <h2 className="font-display text-3xl md:text-4xl font-bold italic text-gray-900 dark:text-white mb-2">
          My Service Reviews
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Reviews you've submitted for services. Help others by sharing your feedback!
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 border border-gray-100 dark:border-neutral-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 text-sm focus:outline-none focus:border-yellow-400 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            {(['recent', 'rating-high', 'rating-low'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  sortBy === option
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                {option === 'recent' ? 'Recent' : option === 'rating-high' ? 'High Rated' : 'Low Rated'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-gray-200 dark:border-neutral-700 border-t-yellow-400 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading your reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-neutral-800">
          <MessageSquare className="w-12 h-12 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">No reviews yet</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No reviews match your search' : 'Start reviewing services from your completed bookings!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 border border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {review.service_name || 'Service'}
                  </h4>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                      {review.rating}/5
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Review Text */}
                  {review.review && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                      "{review.review}"
                    </p>
                  )}
                </div>

                {/* Action */}
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors text-xs font-bold uppercase">
                  <ThumbsUp className="w-3 h-3" /> Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
