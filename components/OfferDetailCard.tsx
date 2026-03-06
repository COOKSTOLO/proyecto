import Image from 'next/image';

interface OfferDetailCardProps {
  title: string;
  price: string;
  description: string;
  user: {
    name: string;
    avatar: string;
    publishedAt: string;
  };
  likes: number;
  source: string;
  imageUrl: string;
  affiliateLink: string;
  onDelete: () => void;
}

export default function OfferDetailCard({
  title,
  price,
  description,
  user,
  likes,
  source,
  imageUrl,
  affiliateLink,
  onDelete,
}: OfferDetailCardProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      {/* Image Section */}
      <div className="relative h-96 rounded-lg overflow-hidden">
        <Image
          alt={title}
          src={imageUrl}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
        <div className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-6">{price}</div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{description}</p>

        {/* User Info */}
        <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Image
            alt={user.name}
            src={user.avatar}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.publishedAt}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <p>❤️ {likes} me gusta</p>
          <p>📦 Fuente: {source}</p>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-auto">
          <a
            href={affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 bg-orange-600 dark:bg-orange-700 text-white text-center rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition font-medium"
          >
            Ver Oferta 🔥
          </a>
          <button
            onClick={onDelete}
            className="block w-full px-6 py-3 bg-red-500 dark:bg-red-600 text-white text-center rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition font-medium"
          >
            Eliminar Oferta
          </button>
        </div>
      </div>
    </div>
  );
}