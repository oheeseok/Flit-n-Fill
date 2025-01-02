import React from "react";

interface LayoutProps {
    children: React.ReactNode; // 자식 컴포넌트 타입 정의
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <header>
                <h1>My Application</h1>
                {/* 여기에 헤더나 네비게이션 바를 추가할 수 있습니다. */}
            </header>
            <main>
                {children} {/* 자식 컴포넌트를 여기에 렌더링 */}
            </main>
            <footer>
                {/* 여기에 푸터를 추가할 수 있습니다. */}
                <p>© 2025 My Application</p>
            </footer>
        </div>
    );
};

export default AdminLayout;