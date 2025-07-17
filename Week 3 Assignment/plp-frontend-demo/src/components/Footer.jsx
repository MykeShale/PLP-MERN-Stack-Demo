import React from 'react'
export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-black dark:text-white text-center py-4 mt-8">
      <p className="text-sm">&copy; {new Date().getFullYear()} FlowForge. All rights reserved.</p>
    </footer>
  );
}
