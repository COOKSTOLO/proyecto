import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <button onClick={handleLike} className="text-red-500 hover:text-red-700">
      ❤️ {likes}
    </button>
  );
}