import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, selectIsDark } from "../../store/slices/themeSlice";
import { HiSun, HiMoon } from "react-icons/hi";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDark = useSelector(selectIsDark);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="
        relative w-14 h-7 rounded-full transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        bg-gray-200 dark:bg-primary
      "
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-6 h-6 rounded-full
          bg-white shadow-md transition-transform duration-300 flex items-center justify-center
          ${isDark ? "translate-x-7" : "translate-x-0"}
        `}
      >
        {isDark ? (
          <HiMoon className="text-primary text-sm" />
        ) : (
          <HiSun className="text-yellow-500 text-sm" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
