import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      // TODO: replace with real auth call (next‑auth signIn)
      // Simulate delay
      await new Promise((r) => setTimeout(r, 800));
      // For demo, accept any credentials
      onClose();
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl ring-1 ring-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Enterprise BPM
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>
                </form>
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Demo logins</p>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>Super Admin – admin@example.com</li>
                  <li>Tenant Admin – tenant.admin@example.com</li>
                  <li>Manager – manager@example.com</li>
                  <li>Finance – finance@example.com</li>
                  <li>Requester – requester@example.com</li>
                </ul>
              </div>
              </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
