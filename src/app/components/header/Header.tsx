import Button from "../Button";

const Header = () => {
  return (
    <header>
      <div className="grid lg:grid-cols-2 bg-red-300 px-2 py-4 place-items-center">
        <h1 className="text-4xl">タスク管理アプリ</h1>
        <nav className="flex gap-4 text-2xl">
          <li>
            <Button title="Create" href="/create" />
          </li>
          <li>
            <Button title="LogIn" href="/login" />
          </li>
          <li>
            <Button title="SignUp" href="/signup" />
          </li>
        </nav>
      </div>
    </header>
  );
};

export default Header;
