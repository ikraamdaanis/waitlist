import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <title>Outdoor ventures</title>
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex flex-1">
          <Link
            href="/"
            className="flex gap-2 text-xl text-green-700 items-center font-semibold"
          >
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=700"
              alt=""
            />
            Outdoor Ventures
          </Link>
        </div>
        {currentPath === "/" && (
          <div className="flex flex-1 justify-end">
            <Link
              href="/admin"
              className="sm:text-lg font-semibold leading-6 text-gray-900"
            >
              Admin <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
