import { Link } from 'react-router';
import { LuGithub } from 'react-icons/lu';

export default function Footer() {
  const version = browser.runtime.getManifest().version;

  return (
    <footer className="w-full p-4 border-t border-gray-200 flex flex-col items-center">
      <Link
        to="https://github.com/karpitony/dgu-ecko"
        target="_blank"
        className="flex items-center text-gray-500 hover:text-gray-700 text-base"
      >
        <LuGithub className="w-4 h-4 mr-1" />
        GitHub Repository
      </Link>
      <p className="text-gray-400 text-sm mt-1">Version {version}</p>
    </footer>
  );
}
