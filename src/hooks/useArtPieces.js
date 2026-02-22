import { useState, useEffect } from 'react';
import { client } from '../lib/sanityClient';

const QUERY = `*[_type == "artPiece"] | order(_createdAt asc) {
  "id": _id,
  name,
  "slug": slug.current,
  medium,
  client,
  description,
  category,
  "images": images[].asset->url
}`;



export function useArtPieces() {
  const [artPieces, setArtPieces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.fetch(QUERY).then((data) => {
      console.log('Sanity data:', data);
      setArtPieces(data);
      setLoading(false);
    }).catch((err) => {
      console.error('Sanity fetch error:', err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    client.fetch(QUERY).then((data) => {
      setArtPieces(data);
      setLoading(false);
    });
  }, []);

  return { artPieces, loading };
}