import React from 'react'
import { useState, useEffect } from "react";
import Card from "../components/Card";
import Button from "../components/Button"
export default function ApiData() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data.");
        setLoading(false);
      });
  }, [page]);


  const filtered = data.filter(item => item.title.includes(query));

  return (
    <div className='dark:text-white'>
      <h1 className="text-2xl mb-4 text-white">Posts</h1>
      <input
        className="border p-2 mb-4 w-full outline-none bg-white text-black"
        placeholder="Search titles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p className='text-white'>Loading api data...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(post => (
          <Card key={post.id} title={post.title}>
            <p>{post.body}</p>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={() => setPage(p => Math.max(p - 1, 1))}>Previous</Button>
        <Button onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
