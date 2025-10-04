"use client";

import { useState, useEffect } from "react";
import { NavigationLayout } from "@/components/navigation-layout";
import { Quote } from "@/lib/database";
import { MessageSquare, Plus, X, User, Calendar, HelpCircle } from "lucide-react";
import { useSession } from "@/contexts/session-context";
import { quotesApi } from "@/lib/api-client";

export default function QuoteWallPage() {
  const { user } = useSession();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    quoteText: "",
    whoSaidIt: "",
    whenSaid: "",
    whySaid: ""
  });

  useEffect(() => {
    if (user) {
      loadQuotes();
    }
  }, [user]);

  const loadQuotes = async () => {
    try {
      const response = await quotesApi.getQuotes();
      if (response.data && typeof response.data === 'object' && 'quotes' in response.data) {
        setQuotes((response.data as { quotes: Quote[] }).quotes);
      }
    } catch (error) {
      console.error('Failed to load quotes:', error);
    }
  };

  const handleAddQuote = async () => {
    if (!formData.quoteText.trim() || !formData.whoSaidIt.trim()) return;

    try {
      console.log('Creating quote with data:', {
        text: formData.quoteText.trim(),
        author: formData.whoSaidIt.trim(),
        context: formData.whenSaid.trim() || undefined,
        whenSaid: formData.whenSaid.trim() || undefined,
        whySaid: formData.whySaid.trim() || undefined
      });

      const response = await quotesApi.createQuote({
        text: formData.quoteText.trim(),
        author: formData.whoSaidIt.trim(),
        context: formData.whenSaid.trim() || undefined,
        whenSaid: formData.whenSaid.trim() || undefined,
        whySaid: formData.whySaid.trim() || undefined
      });

      console.log('Quote creation response:', response);

      if (response.data) {
        await loadQuotes();
        setShowAddModal(false);
        setFormData({
          quoteText: "",
          whoSaidIt: "",
          whenSaid: "",
          whySaid: ""
        });
      } else {
        console.error('No data in quote response:', response);
      }
    } catch (error) {
      console.error('Failed to create quote:', error);
    }
  };

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Quote Wall</h1>
            <p className="text-gray-400 mt-1">Inspirational and memorable quotes from the team</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Submit Quote</span>
          </button>
        </div>
      </div>

      {/* Quotes Container */}
      <div className="max-w-4xl mx-auto p-6">
        {quotes.length > 0 ? (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500 hover:bg-gray-750 transition-colors"
              >
                {/* Quote Text */}
                <div className="mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-400 mb-2" />
                  <blockquote className="text-xl font-serif italic text-gray-100 leading-relaxed">
                    &ldquo;{quote.quoteText}&rdquo;
                  </blockquote>
                </div>

                {/* Quote Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-400">Who said it:</span>
                    <span className="text-gray-200 font-medium">{quote.whoSaidIt}</span>
                  </div>

                  {quote.whenSaid && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-400">When:</span>
                      <span className="text-gray-200">{quote.whenSaid}</span>
                    </div>
                  )}

                  {quote.whySaid && (
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-400">Why:</span>
                      <span className="text-gray-200">{quote.whySaid}</span>
                    </div>
                  )}
                </div>

                {/* Submission Info */}
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                  <span>Submitted by {quote.submittedByName}</span>
                  <span>{new Date(quote.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No quotes yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Submit First Quote</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Quote Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Submit a Quote</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Quote Text *
                </label>
                <textarea
                  value={formData.quoteText}
                  onChange={(e) => setFormData({...formData, quoteText: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none font-serif"
                  placeholder="Enter the exact quote..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Who said it? *
                </label>
                <input
                  type="text"
                  value={formData.whoSaidIt}
                  onChange={(e) => setFormData({...formData, whoSaidIt: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Person's name or title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  When was it said?
                </label>
                <input
                  type="text"
                  value={formData.whenSaid}
                  onChange={(e) => setFormData({...formData, whenSaid: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., During training, Last night, In the meeting..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Why was it said?
                </label>
                <textarea
                  value={formData.whySaid}
                  onChange={(e) => setFormData({...formData, whySaid: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Context or reason for the quote..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuote}
                disabled={!formData.quoteText.trim() || !formData.whoSaidIt.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </NavigationLayout>
  );
}