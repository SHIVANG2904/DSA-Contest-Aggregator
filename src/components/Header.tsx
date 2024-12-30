import { Code } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { AuthButton } from './AuthButton';
import { NotificationToggle } from './NotificationToggle';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
              Coding Contest Hub
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationToggle />
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}