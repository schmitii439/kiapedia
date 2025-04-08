import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Icons importieren
import thumbsUp from '@assets/fire-level-7.png';  // Zustimmung
import neutral from '@assets/fire-level-4.png';    // Neutral
import thumbsDown from '@assets/fire-level-1.png'; // Ablehnung
import replyIcon from '@assets/reply.png';         // Antwort-Icon

interface ReactionButtonsProps {
  postId: number;
  className?: string;
}

export const ReactionButtons: React.FC<ReactionButtonsProps> = ({ postId, className }) => {
  const { toast } = useToast();
  const [reactions, setReactions] = useState({
    agree: 0,
    neutral: 0,
    disagree: 0,
  });
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [comments, setComments] = useState<Array<{id: number, text: string, replies: Array<{id: number, text: string}>}>>([]);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  // Reaktion hinzufügen
  const handleReaction = (type: 'agree' | 'neutral' | 'disagree') => {
    // Wenn der Benutzer bereits reagiert hat, entferne die vorherige Reaktion
    if (userReaction) {
      setReactions(prev => ({
        ...prev,
        [userReaction]: prev[userReaction as keyof typeof prev] - 1
      }));
    }

    // Wenn der Benutzer auf die gleiche Reaktion klickt, entferne sie
    if (userReaction === type) {
      setUserReaction(null);
      return;
    }

    // Neue Reaktion hinzufügen
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    setUserReaction(type);

    // Feedback anzeigen
    const messages = {
      agree: "Du stimmst diesem Beitrag zu",
      neutral: "Du stehst diesem Beitrag neutral gegenüber",
      disagree: "Du stimmst diesem Beitrag nicht zu"
    };

    toast({
      title: "Reaktion gespeichert",
      description: messages[type],
      duration: 2000,
    });
  };

  // Kommentar hinzufügen
  const handleAddComment = () => {
    if (commentText.trim()) {
      if (replyToCommentId !== null) {
        // Antwort zu einem bestehenden Kommentar hinzufügen
        setComments(prev => prev.map(comment => {
          if (comment.id === replyToCommentId) {
            return {
              ...comment,
              replies: [...comment.replies, { id: Date.now(), text: commentText }]
            };
          }
          return comment;
        }));
        
        toast({
          title: "Antwort hinzugefügt",
          description: "Deine Antwort wurde erfolgreich hinzugefügt.",
          duration: 2000,
        });
      } else {
        // Neuen Kommentar hinzufügen
        setComments(prev => [...prev, { id: Date.now(), text: commentText, replies: [] }]);
        
        toast({
          title: "Kommentar hinzugefügt",
          description: "Dein Kommentar wurde erfolgreich hinzugefügt.",
          duration: 2000,
        });
      }

      // Dialog schließen und Formular zurücksetzen
      setCommentText('');
      setShowCommentDialog(false);
      setReplyToCommentId(null);
    }
  };

  // Dialog zum Antworten auf einen Kommentar öffnen
  const handleReply = (commentId: number) => {
    setReplyToCommentId(commentId);
    setShowCommentDialog(true);
  };

  // Dialog zum Kommentieren öffnen
  const handleOpenCommentDialog = () => {
    setReplyToCommentId(null);
    setShowCommentDialog(true);
  };

  return (
    <div className={`mt-6 ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 bg-gray-800 rounded-lg p-3 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center ${userReaction === 'agree' ? 'text-cyan-400' : 'text-gray-300'}`}
            onClick={() => handleReaction('agree')}
          >
            <img src={thumbsUp} alt="Zustimmung" className="w-8 h-8 mb-1" />
            <span className="text-sm">Stimme zu</span>
            {reactions.agree > 0 && <span className="text-xs mt-1">{reactions.agree}</span>}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center ${userReaction === 'neutral' ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => handleReaction('neutral')}
          >
            <img src={neutral} alt="Neutral" className="w-8 h-8 mb-1" />
            <span className="text-sm">Neutral</span>
            {reactions.neutral > 0 && <span className="text-xs mt-1">{reactions.neutral}</span>}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center ${userReaction === 'disagree' ? 'text-red-400' : 'text-gray-300'}`}
            onClick={() => handleReaction('disagree')}
          >
            <img src={thumbsDown} alt="Ablehnung" className="w-8 h-8 mb-1" />
            <span className="text-sm">Stimme nicht zu</span>
            {reactions.disagree > 0 && <span className="text-xs mt-1">{reactions.disagree}</span>}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center text-gray-300"
            onClick={handleOpenCommentDialog}
          >
            <img src={replyIcon} alt="Kommentieren" className="w-8 h-8 mb-1" />
            <span className="text-sm">Kommentieren</span>
            {comments.length > 0 && <span className="text-xs mt-1">{comments.length}</span>}
          </motion.button>
        </div>
      </div>

      {/* Kommentare anzeigen */}
      {comments.length > 0 && (
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-white">Kommentare</h3>
          
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-200">{comment.text}</p>
              
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-400">Kommentar #{comment.id.toString().slice(-4)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 text-xs"
                  onClick={() => handleReply(comment.id)}
                >
                  <img src={replyIcon} alt="Antworten" className="w-4 h-4 mr-1" />
                  Antworten
                </Button>
              </div>
              
              {/* Antworten anzeigen */}
              {comment.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l border-gray-700 space-y-2">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-200">{reply.text}</p>
                      <span className="text-xs text-gray-400 mt-1 block">Antwort #{reply.id.toString().slice(-4)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Kommentar-Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-gray-900 to-gray-800 border border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {replyToCommentId !== null ? "Auf Kommentar antworten" : "Kommentar hinzufügen"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder={replyToCommentId !== null ? "Deine Antwort..." : "Dein Kommentar..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[120px] bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowCommentDialog(false)}>
              Abbrechen
            </Button>
            <Button 
              type="button" 
              onClick={handleAddComment}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30 shadow-md"
              disabled={!commentText.trim()}
            >
              {replyToCommentId !== null ? "Antworten" : "Kommentieren"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReactionButtons;