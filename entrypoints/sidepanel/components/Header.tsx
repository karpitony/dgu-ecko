import { Link } from 'react-router';

const NavItem = [
  {
    name: 'assignment',
    label: '과제',
  },
  {
    name: 'vod',
    label: '싸강',
  },
  {
    name: 'settings',
    label: '설정',
  },
];

export default function Header() {
  return (
    <header className="flex flex-row justify-between items-center px-2 w-full">
      <Link
        to="/index.html"
        className="flex items-center justify-center p-1 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <h1 className="text-2xl font-bold">🐘 이코</h1>
      </Link>
      <nav className="flex flex-row gap-2 text-lg font-semibold">
        {NavItem.map(item => (
          <p>
            <Link
              to={`/${item.name}`}
              className="flex items-center justify-center p-1 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {item.label}
            </Link>
          </p>
        ))}
      </nav>
    </header>
  );
}
