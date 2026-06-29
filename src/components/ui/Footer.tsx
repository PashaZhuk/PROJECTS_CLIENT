const Footer = () => {
  return (
    <footer className="bg-white border-t py-2 mt-auto">
      <div className="container mx-auto px-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="text-xs font-bold text-gray-900">ООО &laquo;АйПиМатика Бел&raquo;</span>
            <p className="text-[10px] text-gray-400 leading-tight">Пилим сами</p>
            <a
              href="https://www.ipmatika.by"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-400 hover:text-blue-600 transition-colors"
            >
              www.ipmatika.by
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
