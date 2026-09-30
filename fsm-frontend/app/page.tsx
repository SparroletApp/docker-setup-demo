import Link from "next/link";
import "./page.css";

export default function Home() {
    return (
        <div className="home-container">
            <Link href="/user-login" className="user-login-button">
                User Login
            </Link>
        </div>
    );
}