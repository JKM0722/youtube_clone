"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/video/${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        YouTube Clone
      </Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          🔍
        </button>
      </form>
    </nav>
  );
} 