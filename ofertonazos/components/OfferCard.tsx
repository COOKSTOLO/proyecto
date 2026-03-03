export default function OfferCard({ offer }: { offer: any }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img src={offer.imageUrl} alt={offer.title} className="w-full h-48 object-cover rounded" />
      <h2 className="text-lg font-bold mt-2">{offer.title}</h2>
      <p className="text-gray-600">{offer.price} USD</p>
      <p className="text-sm text-gray-500">By {offer.userName}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600">
        Ir a oferta
      </button>
    </div>
  );
}