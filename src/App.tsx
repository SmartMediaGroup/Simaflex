import { collection, getDocs } from "firebase/firestore";
import { db } from "./services/firebase";
import { motion } from "motion/react";
import {
  Phone,
  ShieldCheck,
  Gem,
  Heart,
  ArrowRight,
  CheckCircle,
  Wind,
  VolumeX,
  Activity,
  Cpu,
  Leaf,
  Shield,
  Star,
  MapPin,
  Mail,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  X,
  ChevronDown,
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Twitter,
  Share2
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { blogArticles } from "./data/blogData";
import { AdminDashboard } from "./components/AdminDashboard";
import { SEO } from "./components/SEO";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const colors = {
  purple: "#62005A", // Deep plum purple from logo
  orange: "#FF570A", // Bold orange from logo
  lightPurple: "#F8F2F8", // Adjusted light purple
};

const productImagesMap = import.meta.glob('./assets/images/produits/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' }) as Record<string, string>;

export const resolveProductImage = (name: string, defaultImg: string) => {
  if (!name) return defaultImg;
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const path of Object.keys(productImagesMap)) {
    const filename = path.split('/').pop() || '';
    const namePart = filename.replace(/^Simaflex-?\s*/i, '').replace(/\.(png|jpe?g|webp)$/i, '');
    const normalizedFile = namePart.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (normalizedFile === normalizedName || normalizedFile.startsWith(normalizedName) || normalizedFile.includes(normalizedName)) {
      return productImagesMap[path];
    }
  }
  return defaultImg;
};

export const productsData = [
  {
    id: "carnaval",
    name: "Carnaval",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/02/carnaval-scaled.jpg",
    desc: "Ressorts biconiques, 25cm. Traité antibactérien.",
    fullDesc:
      "Carnaval est un matelas de haute qualité conçu pour vous offrir un sommeil réparateur et confortable. Le système de ressorts biconiques traités anti-affaissement garantit une longue durée de vie, tandis que le garnissage en mousse polyuréthane à haute densité offre un relâchement musculaire pour un sommeil plus confortable.",
    features: [
      "Hauteur : 25 cm",
      "Ressorts biconiques traités anti-affaissement",
      "Garnissage : Mousse polyuréthane à haute densité",
      "Tissu traité antibactériens et anti-acariens",
      "Système d'aération active sur les zones de confort",
      "Garantie : 5 ans",
    ],
  },
  {
    id: "age-dor",
    name: "Age d'Or",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/02/age-dor-scaled.jpg",
    desc: "Mousse polyuréthane, 27cm. Protection de la colonne.",
    fullDesc:
      "Age d'Or est un matelas de haute qualité de 27 cm, conçu pour soutenir votre corps et offrir un soutien optimal. Le système de ressorts biconiques indéformables garantit une longue durée de vie, tandis que la mousse polyuréthane protège votre colonne vertébrale.",
    features: [
      "Hauteur : 27 cm",
      "Ressorts biconiques indéformables",
      "Garnissage : Mousse polyuréthane protectrice",
      "Tissu de haute qualité et doux",
      "Système d'aération pour la circulation de l'air",
      "Garantie : 5 ans",
    ],
  },
  {
    id: "dorsalit",
    name: "Dorsalit",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/02/dorsalit-scaled.jpg",
    desc: "Ressorts biconiques, 27cm. Stabilité au sommeil.",
    fullDesc:
      "Dorsalit est un matelas innovant avec une hauteur de 27 cm. Les ressorts biconiques assurent une stabilité constante pendant votre sommeil, pour un réveil plus frais et plus détendu. Un excellent atout pour prévenir les maux de dos.",
    features: [
      "Hauteur : 27 cm",
      "Ressorts biconiques assurant la stabilité",
      "Garnissage : Mousse polyuréthane",
      "Tissu excellent pour une touche spéciale",
      "Système d'aération intégré",
      "Garantie : 5 ans",
    ],
  },
  {
    id: "rivera",
    name: "Rivera",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/02/rivera-scaled.jpg",
    desc: "Ressorts biconiques, 28cm. Anti-affaissement.",
    fullDesc:
      "Le Rivera avec sa hauteur de 28 cm vous offre un soutien optimal. Le garnissage en mousse polyuréthane à haute densité garde votre matelas en bonne santé plus longtemps. Tissu antibactérien et anti-acariens.",
    features: [
      "Hauteur : 28 cm",
      "Ressorts biconiques traités anti-affaissement",
      "Mousse polyuréthane à haute densité",
      "Tissu traité antibactériens et anti-acariens",
      "Système d'aération optimal",
      "Garantie : 5 ans",
    ],
  },
  {
    id: "renaissance",
    name: "Renaissance",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/02/renaissance-scaled.jpg",
    desc: "Haute densité, 29cm. Relâchement musculaire.",
    fullDesc:
      "Le Matelas Renaissance offre un soutien optimal. Le garnissage composé de mousse à haute densité et de mousse ultra souple assure un relâchement musculaire et un soutien dorsal. Tissu résistant et robuste.",
    features: [
      "Hauteur : 29 cm",
      "Ressorts biconiques indéformables",
      "Combinaison mousse haute densité et ultra souple",
      "Tissu de haute qualité, résistant",
      "Poignées tissées et brodées",
      "Garantie : 5 ans",
    ],
  },
  {
    id: "orthomedic",
    name: "Orthomedic",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/02/orthomedic-scaled.jpg",
    desc: "Haute densité, 30cm. Soutien dorsal incomparable.",
    fullDesc:
      "Conçu pour une nuit de sommeil confortable et réparatrice. Avec 30 cm de hauteur et des ressorts biconiques indéformables. La mousse polyuréthane haute résilience offre un soutien dorsal incomparable.",
    features: [
      "Hauteur : 30 cm",
      "Ressorts biconiques indéformables",
      "Mousse polyuréthane haute densité et haute résilience",
      "Tissu excellent signé SIMAFLEX",
      "Confort thermique et ventilation",
      "Garantie : 10 ans",
    ],
  },
  {
    id: "medicazone",
    name: "Medica Zone",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/02/MedicaZone.png",
    desc: "Ressorts ensachés, 30cm. Qualité de confort idéale.",
    fullDesc:
      "Conçu pour offrir un soutien et un confort inégalés avec des ressorts ensachés qui assurent une qualité de confort idéale et une excellente indépendance de couchage. Le système d'aération évacue naturellement la chaleur.",
    features: [
      "Hauteur : 30 cm",
      "Ressorts ensachés indépendants",
      "Mousse polyuréthane extra ferme",
      "Tissu de haute qualité signé SIMAFLEX",
      "4 poignées tissées et brodées",
      "Garantie : 10 ans",
    ],
  },
  {
    id: "serenity",
    name: "Serenity",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/02/serenity-scaled.jpg",
    desc: "Ressorts ensachés, 30cm. Confort durable.",
    fullDesc:
      "Les ressorts ensachés assurent un retour rapide à la forme d'origine. Le coutil stretch est spécialement conçu pour être antibactérien et anti-acarien pour un environnement de sommeil plus sain et durable.",
    features: [
      "Hauteur : 30 cm",
      "Ressorts ensachés (retour de forme rapide)",
      "Mousse polyuréthane à haute densité",
      "Coutil stretch spécial antibactériens",
      "Système d'aération active",
      "Garantie : 10 ans",
    ],
  },
  {
    id: "roll-packed",
    name: "Roll-Packed",
    category: "Matelas",
    img: "https://simaflex.ma/wp-content/uploads/2023/04/Roll-Packed.png",
    desc: "Mousse à mémoire de forme. Facile à transporter.",
    fullDesc:
      "Le matelas Roll-Packed compressé sous vide de Simaflex est le compagnon parfait. La mousse à mémoire de forme réagit à votre chaleur corporelle pour vous offrir un soutien personnalisé et soulager les points de pression.",
    features: [
      "Mousse à mémoire de forme de haute qualité",
      "Compressé sous vide et roulé pour transport",
      "Résistant aux acariens et allergènes",
      "Mousse haute densité indéformable",
      "Installation facile et rapide",
      "Garantie de satisfaction",
    ],
  },
  {
    id: "babylax",
    name: "Oreiller Babylax",
    category: "Accessoires",
    img: "https://simaflex.ma/wp-content/uploads/2023/04/Babylax.png",
    desc: "Conçu pour les bébés, ultra doux et respirant.",
    fullDesc:
      "Spécialement conçu pour votre enfant, cet oreiller extra-plat, doux et respirant offre un gonflant exceptionnel tout en préservant le développement et la croissance du bébé.",
    features: [
      "Conçu pour les bébés de 0 à 6 mois",
      "Lavage en machine à 40°C",
      "Anti-allergies et anti-acariens",
      "Dimensions : 50 x 30 cm",
      "Peut être utilisé au lit ou en poussette",
      "Soutien léger de la tête",
    ],
  },
  {
    id: "oreiller-orthomedic",
    name: "Oreiller Orthomédic",
    category: "Accessoires",
    img: "https://simaflex.ma/wp-content/uploads/2023/04/Oreiller-Orthomedic.png",
    desc: "Soutien total de la tête et du cou.",
    fullDesc:
      "Sa forme ergonomique réduit les douleurs cervicales et les raideurs. Réglable en hauteur grâce à son rembourrage en mousse à mémoire de forme. Idéal pour tous les dormeurs.",
    features: [
      "Forme ergonomique pour toutes les positions",
      "Mousse à mémoire de forme de haute qualité",
      "Housse en coton doux et respirant",
      "Hypoallergénique et anti-acariens",
      "Résistant aux déformations",
      "Lavable en machine",
    ],
  },
  {
    id: "oreiller-romance",
    name: "Oreiller Romance Vert D'eau",
    category: "Accessoires",
    img: "https://simaflex.ma/wp-content/uploads/2023/04/Oreiller-Romance.png",
    desc: "Mousse à mémoire de forme, housse en bambou.",
    fullDesc:
      "Conçu pour offrir un confort ultime. Rempli de microfibres de haute qualité et housse en coton égyptien. Un choix écologique qui apporte une touche d'élégance moderne à votre chambre.",
    features: [
      "Housse en coton égyptien (bambou) luxueuse",
      "Remplissage microfibres (matériaux recyclés)",
      "Couleur Vert d'eau très apaisante",
      "Hypoallergénique idéal contre l'asthme",
      "Soutien ferme et moelleux à la fois",
      "Choix respectueux de l'environnement",
    ],
  },
  {
    id: "couette-olympia",
    name: "Couette Olympia",
    category: "Accessoires",
    img: "https://simaflex.ma/wp-content/uploads/2023/04/Couette-Olympia.png",
    desc: "Rembourrage fibres creuses. Légèreté inégalée.",
    fullDesc:
      "Le confort ultime pour un sommeil réparateur. Son rembourrage en fibres creuses siliconées vous offre une douceur inégalée. Son revêtement microfibre est doux et respirant.",
    features: [
      "Rembourrage fibres creuses siliconées",
      "Revêtement microfibre doux et respirant",
      "Thermorégulation optimale pendant la nuit",
      "Résistante à l'affaissement",
      "Lavable en machine et passe au sèche-linge",
      "Disponibles en plusieurs tailles",
    ],
  },
];

const Navbar = ({
  currentRoute,
  onChangeRoute,
}: {
  currentRoute: Route;
  onChangeRoute: (route: Route, category?: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              onChangeRoute("home");
            }}
          >
            <img
              src="/simaflex-logo-color.png"
              alt="Simaflex Logo"
              className="h-16 md:h-20 object-contain"
            />
          </div>

          <div className="hidden lg:flex items-center space-x-8 text-[15px]">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onChangeRoute("home");
              }}
              className={`font-semibold border-b-2 pb-1 ${currentRoute === "home" ? "border-orange-500" : "border-transparent"}`}
              style={{ color: currentRoute === "home" ? colors.purple : '#4b5563', borderColor: currentRoute === "home" ? colors.orange : 'transparent' }}
            >
              Accueil
            </a>
            <a
              href="/about"
              onClick={(e) => { e.preventDefault(); onChangeRoute("about"); }}
              className={`font-medium transition-colors pb-1 border-b-2 ${currentRoute === "about" ? "border-orange-500" : "border-transparent hover:text-[#2A1659]"}`}
              style={{ color: currentRoute === "about" ? colors.purple : '#4b5563' }}
            >
              À propos
            </a>
            <div className="relative group">
              <a
                href="/#produits"
                onClick={(e) => { e.preventDefault(); onChangeRoute("home"); }}
                className={`font-medium transition-colors flex items-center gap-1 pb-1 border-b-2 border-transparent hover:text-[#2A1659]`}
                style={{ color: '#4b5563' }}
              >
                Nos produits <ChevronDown size={16} />
              </a>
              <div className="absolute left-0 mt-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 py-2">
                  {['Matelas', 'Salons', 'Accessoires'].map((cat) => (
                    <a
                      key={cat}
                      href={`/${cat.toLowerCase()}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onChangeRoute("home", cat);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <a
              href="/store_locator"
              onClick={(e) => {
                e.preventDefault();
                onChangeRoute("store_locator");
              }}
              className={`font-medium transition-colors pb-1 border-b-2 ${currentRoute === "store_locator" ? "border-orange-500" : "border-transparent hover:text-[#2A1659]"}`}
              style={{ color: currentRoute === "store_locator" ? colors.purple : '#4b5563' }}
            >
              Points de vente
            </a>
            <a
              href="/blog"
              onClick={(e) => { e.preventDefault(); onChangeRoute("blog"); }}
              className={`font-medium transition-colors pb-1 border-b-2 ${currentRoute === "blog" ? "border-orange-500" : "border-transparent hover:text-[#2A1659]"}`}
              style={{ color: currentRoute === "blog" ? colors.purple : '#4b5563' }}
            >
              Conseils sommeil
            </a>
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); onChangeRoute("contact"); }}
              className={`font-medium transition-colors pb-1 border-b-2 ${currentRoute === "contact" ? "border-orange-500" : "border-transparent hover:text-[#2A1659]"}`}
              style={{ color: currentRoute === "contact" ? colors.purple : '#4b5563' }}
            >
              Contact
            </a>
          </div>

          <div className="hidden lg:flex">
            <button
              onClick={() => onChangeRoute("contact")}
              className="flex items-center gap-2 text-white px-6 py-2.5 rounded-full font-medium transition-transform hover:scale-105 shadow-md shadow-orange-500/20"
              style={{ backgroundColor: colors.orange }}
            >
              Nous contacter <Phone size={18} />
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#2A1659]"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg absolute w-full">
          <div className="flex flex-col px-6 py-6 font-medium">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onChangeRoute("home");
                setIsOpen(false);
              }}
              className={`mb-4 ${currentRoute === "home" ? "font-bold text-orange-500" : ""}`}
              style={{ color: currentRoute === "home" ? colors.purple : '#4b5563' }}
            >
              Accueil
            </a>
            <a href="/about" onClick={(e) => { e.preventDefault(); onChangeRoute("about"); setIsOpen(false); }} className={`mb-4 text-gray-600 ${currentRoute === "about" ? "font-bold text-[#2A1659]" : ""}`}>
              À propos
            </a>
            <div className="mb-4">
              <button
                onClick={(e) => { e.preventDefault(); setIsProductsDropdownOpen(!isProductsDropdownOpen); }}
                className="w-full text-gray-600 flex items-center justify-between"
              >
                Nos produits <ChevronDown size={16} className={`transition-transform ${isProductsDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isProductsDropdownOpen && (
                <div className="pl-4 mt-3 flex flex-col gap-3">
                  {['Matelas', 'Salons', 'Accessoires'].map((cat) => (
                    <a
                      key={cat}
                      href={`/${cat.toLowerCase()}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onChangeRoute("home", cat);
                        setIsOpen(false);
                      }}
                      className="text-gray-500 hover:text-orange-500"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a
              href="/store_locator"
              onClick={(e) => {
                e.preventDefault();
                onChangeRoute("store_locator");
                setIsOpen(false);
              }}
              className={`mb-4 text-gray-600 ${currentRoute === "store_locator" ? "font-bold text-[#2A1659]" : ""}`}
            >
              Points de vente
            </a>
            <a href="/blog" onClick={(e) => { e.preventDefault(); onChangeRoute("blog"); setIsOpen(false); }} className={`mb-4 text-gray-600 ${currentRoute === "blog" ? "font-bold text-[#2A1659]" : ""}`}>
              Conseils sommeil
            </a>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onChangeRoute("contact"); setIsOpen(false); }} className={`mb-4 text-gray-600 ${currentRoute === "contact" ? "font-bold text-[#2A1659]" : ""}`}>
              Contact
            </a>
            <button
              onClick={() => { onChangeRoute("contact"); setIsOpen(false); }}
              className="flex items-center justify-center gap-2 text-white px-6 py-3 rounded-full mt-2 w-full"
              style={{ backgroundColor: colors.orange }}
            >
              Nous contacter <Phone size={18} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onChangeRoute }: { onChangeRoute: (route: Route) => void }) => {
  return (
    <section
      className="relative w-full overflow-hidden mt-20"
      style={{ height: "min(80vh, 700px)" }}
    >
      {/* Curved bottom via clipPath */}
      <div
        className="absolute inset-0 z-0"
        style={{ clipPath: "ellipse(150% 100% at 50% 0%)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2000"
          alt="Chambre à coucher élégante"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl pt-10"
          >
            <h1
              className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
              style={{ color: colors.purple }}
            >
              Dormez mieux.
              <br />
              <span style={{ color: colors.orange }}>Vivez mieux.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 font-medium">
              Le confort nouvelle génération signé Simaflex.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onChangeRoute("home");
                  setTimeout(() => {
                    document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-full font-semibold transition-transform hover:scale-105 shadow-xl shadow-orange-500/20"
                style={{ backgroundColor: colors.orange }}
              >
                Découvrir nos produits{" "}
                <ChevronDown size={18} className="-rotate-90" />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onChangeRoute("about");
                }}
                className="flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-8 py-3.5 rounded-full font-semibold transition-all hover:border-[#2A1659] hover:text-[#2A1659]"
              >
                En savoir plus
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesCards = () => {
  const cards = [
    {
      icon: <ShieldCheck size={32} style={{ color: colors.purple }} />,
      title: "Confort absolu",
      desc: "Des produits conçus pour un confort optimal.",
    },
    {
      icon: <Gem size={32} style={{ color: colors.purple }} />,
      title: "Qualité premium",
      desc: "Des matériaux de haute qualité pour une durabilité exceptionnelle.",
    },
    {
      icon: <Heart size={32} style={{ color: colors.purple }} />,
      title: "Bien-être & santé",
      desc: "Un sommeil réparateur pour un meilleur quotidien.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-24 md:-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl shadow-xl shadow-purple-900/5 p-6 md:p-8 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100"
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 lg:p-6 text-center sm:text-left"
          >
            <div className="bg-purple-50 p-4 rounded-xl flex-shrink-0">
              {card.icon}
            </div>
            <div>
              <h3
                className="font-bold text-lg mb-1"
                style={{ color: colors.purple }}
              >
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center mb-12">
    <h2
      className="text-3xl md:text-4xl font-bold mb-4 text-center"
      style={{ color: colors.purple }}
    >
      {title}
    </h2>
    <div className="flex items-center gap-3">
      <div className="h-px w-12 bg-gray-300"></div>
      <div
        className="w-2 h-2 rotate-45"
        style={{ backgroundColor: colors.orange }}
      ></div>
      <div className="h-px w-12 bg-gray-300"></div>
    </div>
  </div>
);

const Universes = () => {
  const items = [
    {
      title: "Matelas",
      img: resolveProductImage("Carnaval", "https://simaflex.ma/wp-content/uploads/2023/02/carnaval-scaled.jpg"),
    },
    {
      title: "Salons",
      img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Accessoires",
      img: "https://simaflex.ma/wp-content/uploads/2023/04/Oreiller-Romance.png",
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle title="Nos univers" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group block relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/90 text-sm font-medium">
                  Voir la collection
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transform transition-transform group-hover:scale-110 shadow-md"
                style={{ backgroundColor: colors.orange }}
              >
                <ArrowRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const FeaturedProduct = ({ onDiscover }: { onDiscover: () => void }) => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="rounded-[40px] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden"
        style={{ backgroundColor: colors.lightPurple }}
      >
        <div className="flex-1 relative z-10">
          <p
            className="uppercase tracking-widest text-sm font-bold mb-2"
            style={{ color: colors.orange }}
          >
            Produit Phare
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            <span style={{ color: colors.purple }}>Medica </span>
            <span style={{ color: colors.orange }}>Zone</span>
          </h2>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed font-medium">
            Une technologie avancée pour un soutien parfait et un confort
            inégalé.
          </p>
          <ul className="space-y-4 mb-10 text-gray-700 font-medium">
            {[
              "Ressorts ensachés indépendants",
              "Soutien ergonomique de la colonne vertébrale",
              "Zéro transfert de mouvement",
              "Circulation d'air optimale",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle size={20} style={{ color: colors.orange }} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDiscover();
            }}
            className="inline-flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-full font-semibold transition-transform hover:scale-105 shadow-lg shadow-orange-500/20"
            style={{ backgroundColor: colors.orange }}
          >
            Découvrir Medica Zone{" "}
            <ChevronDown size={18} className="-rotate-90" />
          </button>
        </div>

        <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[400px]">
          {/* Main Mattress Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={resolveProductImage("Medica Zone", "https://simaflex.ma/wp-content/uploads/2023/02/MedicaZone.png")}
              alt="Matelas Medica Zone"
              className="object-contain w-full h-[300px] md:h-full lg:scale-110 md:translate-x-4 lg:translate-x-10"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <Cpu size={28} />,
      title: "Technologie innovante",
      desc: "Des solutions avancées pour un confort supérieur.",
    },
    {
      icon: <Leaf size={28} />,
      title: "Matériaux haut de gamme",
      desc: "Sélection rigoureuse des meilleurs matériaux.",
    },
    {
      icon: <Wind size={28} />,
      title: "Fabrication experte",
      desc: "Savoir-faire et expertise marocaine.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Engagement qualité",
      desc: "Des produits durables et respectueux.",
    },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle title="Pourquoi choisir Simaflex ?" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((reason, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-20 h-20 outline outline-1 outline-gray-200 outline-offset-4 rounded-full flex items-center justify-center mb-6 text-[#2A1659] bg-white transform transition-transform group-hover:scale-110 shadow-sm">
              {reason.icon}
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">
              {reason.title}
            </h3>
            <p className="text-gray-500 text-sm">{reason.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Youssef B.",
      quote: "Le meilleur matelas que j'ai jamais eu. Confort exceptionnel !",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80",
    },
    {
      name: "Salma R.",
      quote: "Qualité au rendez-vous et un service client très professionnel.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    },
    {
      name: "Karim A.",
      quote:
        "Un vrai changement dans la qualité de mon sommeil. Merci Simaflex !",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
    },
  ];

  return (
    <section className="py-12 pb-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Ils nous font confiance" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
            >
              <div className="flex gap-1 mb-4" style={{ color: colors.orange }}>
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 font-medium mb-6 leading-relaxed">
                « {testi.quote} »
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testi.avatar}
                  alt={testi.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span
                  className="font-semibold text-sm"
                  style={{ color: colors.purple }}
                >
                  {testi.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center flex-row gap-2 mt-10">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.orange }}
          ></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

const ContactBanner = ({ onChangeRoute }: { onChangeRoute?: (route: string) => void }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation of form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="py-0 relative z-20 -mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-2xl h-auto"
      >
        {/* Left Dark Side */}
        <div
          className="flex-1 p-10 flex flex-col justify-center text-white relative lg:min-h-[400px]"
          style={{ backgroundColor: colors.purple }}
        >
          <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-black/20 to-transparent"></div>{" "}
          {/* Subtle depth */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center">
              <MapPin size={24} style={{ color: colors.orange }} />
            </div>
            <h3 className="text-2xl font-bold">Trouvez votre point de vente</h3>
          </div>
          <p className="text-white/80 mb-6 pl-15">
            Découvrez nos revendeurs près de chez vous.
          </p>
          <button
            onClick={() => onChangeRoute && onChangeRoute("store_locator")}
            className="w-max ml-15 flex items-center justify-center text-white px-6 py-2.5 rounded-full font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: colors.orange }}
          >
            Voir les points de vente
          </button>

          <div className="mt-12 pl-15 flex flex-col gap-3">
            <h4 className="text-xl font-bold mb-2">Contactez-nous</h4>
            <a
              href="#"
              className="flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors"
            >
              <Phone size={18} style={{ color: colors.orange }} /> 0535 450 045
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors"
            >
              <Mail size={18} style={{ color: colors.orange }} />{" "}
              contact@simaflex.ma
            </a>
          </div>
        </div>

        {/* Right Light Side - Contact Form */}
        <div
          className="flex-1 p-10 flex flex-col justify-center"
          style={{ backgroundColor: "#FFF2E9" }}
        >
          <h3 className="text-2xl font-bold text-[#2A1659] mb-6">
            Envoyez-nous un message
          </h3>
          
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="text-green-500" size={24} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Message envoyé !</h4>
              <p className="text-gray-600 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Votre nom complet" 
                required
                className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-white"
              />
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-white"
              />
              <textarea 
                placeholder="Votre message..." 
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-white resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-[1.02] mt-2 shadow-lg shadow-orange-500/20"
                style={{ backgroundColor: colors.orange }}
              >
                Envoyer <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
};

const Footer = ({ onChangeRoute }: { onChangeRoute: (route: Route, category?: string) => void }) => {
  return (
    <footer
      className="pt-40 pb-10 text-white"
      style={{ backgroundColor: colors.purple }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 border-b border-white/10 pb-12">
          <div className="lg:col-span-2">
            <div className="relative inline-flex items-center mb-6">
              <img
                src="/simaflex-logo-white.png"
                alt="Simaflex Logo White"
                className="h-14 md:h-20 object-contain"
              />
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm">
              Simaflex société Marocaine spécialisée dans la literie, fabrication des matelas et de la mousse.
            </p>
            <div className="text-white/70 text-sm space-y-3 mb-8">
              <p className="flex items-start gap-2">
                <span className="mt-0.5" aria-hidden="true">📍</span>
                <span>Rte El Hajeb, km 7.3,<br />Mejjat MEKNES</span>
              </p>
              <p className="flex items-center gap-2">
                <span aria-hidden="true">✉️</span>
                <a href="mailto:Simaflex.assist@gmail.com" className="hover:text-white transition-colors">Simaflex.assist@gmail.com</a>
              </p>
              <p className="flex items-start gap-2">
                <span className="mt-0.5" aria-hidden="true">📞</span>
                <span>0535 450 045 / 06 61 24 05 43</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://web.facebook.com/simaflexofficiel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/simaflex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@Simaflex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Nos produits</h4>
            <ul className="space-y-4 text-white/70 text-sm">
              <li>
                <a href="/matelas" onClick={(e) => { e.preventDefault(); onChangeRoute("home", "Matelas"); }} className="hover:text-white transition-colors">
                  Matelas
                </a>
              </li>
              <li>
                <a href="/salons" onClick={(e) => { e.preventDefault(); onChangeRoute("home", "Salons"); }} className="hover:text-white transition-colors">
                  Salons
                </a>
              </li>
              <li>
                <a href="/accessoires" onClick={(e) => { e.preventDefault(); onChangeRoute("home", "Accessoires"); }} className="hover:text-white transition-colors">
                  Accessoires
                </a>
              </li>
              <li>
                <a href="/#nouveautes" onClick={(e) => { e.preventDefault(); onChangeRoute("home"); }} className="hover:text-white transition-colors">
                  Nouveautés
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Informations</h4>
            <ul className="space-y-4 text-white/70 text-sm">
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); onChangeRoute("about"); }} className="hover:text-white transition-colors">
                  À propos de nous
                </a>
              </li>
              <li>
                <a href="/about#qualite" onClick={(e) => { e.preventDefault(); onChangeRoute("about"); }} className="hover:text-white transition-colors">
                  Qualité & certifications
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => { e.preventDefault(); onChangeRoute("blog"); }} className="hover:text-white transition-colors">
                  Conseils sommeil
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); onChangeRoute("contact"); }} className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col md:items-start">
            <h4 className="font-bold text-lg mb-6">Points de vente</h4>
            <a 
              href="/store_locator" 
              onClick={(e) => { e.preventDefault(); onChangeRoute("store_locator"); }}
              className="block cursor-pointer overflow-hidden rounded-xl transition-colors group w-40 hover:opacity-80"
            >
              <img 
                src="/MAROC-MAP-SIMAFLEX.png" 
                alt="Carte du Maroc Simaflex" 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
              />
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-xs">
          <p>© 2026 Simaflex. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="/legal" onClick={(e) => { e.preventDefault(); onChangeRoute("legal"); }} className="hover:text-white transition-colors">
              Mentions légales
            </a>
            <span className="hidden md:inline">|</span>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); onChangeRoute("privacy"); }} className="hover:text-white transition-colors">
              Politique de confidentialité
            </a>
            <span className="hidden md:inline">|</span>
            <a href="/admin" onClick={(e) => { e.preventDefault(); onChangeRoute("admin"); }} className="hover:text-white transition-colors">
              Administration
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ProductCatalog = ({
  products,
  onProductClick,
  activeCategory,
  onCategoryChange
}: {
  products: any[];
  onProductClick: (product: any) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}) => {
  const [localActiveTab, setLocalActiveTab] = useState("Matelas");
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const tabs = ["Matelas", "Salons", "Accessoires"];

  const currentTab = activeCategory || localActiveTab;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab: string) => {
    setLocalActiveTab(tab);
    if (onCategoryChange) {
      onCategoryChange(tab);
    }
  };

  const filteredProducts = products.filter((p) => p.category === currentTab);

  return (
    <section id="product-catalog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50/30">
      <SectionTitle title="Découvrez nos collections" />

      <div className="mb-12 relative rounded-3xl overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <video 
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
        >
          <source
            src="https://simaflex.ma/wp-content/uploads/2023/02/SimaflexBG.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20">
          <p className="text-white/90 font-semibold mb-2 uppercase tracking-widest text-sm" style={{ color: colors.orange }}>L'art du Confort</p>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Trouvez votre repos idéal</h3>
          <p className="text-white/80 max-w-2xl text-lg hidden md:block">
            Explorez notre sélection méticuleuse de matelas, salons et accessoires conçus pour sublimer vos nuits et vos moments de détente.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all border-2 ${
              currentTab === tab
                ? "border-[#F37517] text-white shadow-md"
                : "border-transparent text-gray-500 hover:border-gray-200 bg-gray-100 hover:bg-gray-200"
            }`}
            style={
              currentTab === tab
                ? { backgroundColor: colors.orange, borderColor: colors.orange }
                : {}
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="relative group/carousel">
          {filteredProducts.length > 1 && (
            <>
              <button 
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-50 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-50 opacity-0 group-hover/carousel:opacity-100 transition-opacity"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProducts.map((product, i) => (
              <motion.a
                key={product.id}
                href={`/${(product.category || "produit").toLowerCase()}/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={(e) => {
                  e.preventDefault();
                  onProductClick(product);
                }}
                className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] snap-start bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group cursor-pointer min-w-0"
              >
              <div className="aspect-square w-full bg-white p-4 flex items-center justify-center overflow-hidden border-b border-gray-50 relative">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: colors.orange }}
                >
                  {product.category}
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: colors.purple }}
                >
                  {product.name}
                </h3>
                <div 
                   className="text-gray-500 text-sm mb-4 line-clamp-2"
                   dangerouslySetInnerHTML={{ __html: product.desc || product.fullDesc || '' }}
                />
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    className="text-sm font-semibold flex items-center gap-1 transition-colors"
                    style={{ color: colors.purple }}
                  >
                    En savoir plus <ArrowRight size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(product); }} 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Aperçu
                  </button>
                </div>
              </div>
            </motion.a>
          ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
          <span className="block text-4xl mb-4">🛋️</span>
          <p className="font-medium">
            La collection {currentTab} sera bientôt disponible.
          </p>
        </div>
      )}

      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row relative shadow-2xl max-h-[90vh]"
          >
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
              <X size={20} />
            </button>
            <div className="w-full md:w-1/2 p-8 bg-gray-50 flex items-center justify-center min-h-[300px]">
              <img src={quickViewProduct.img} alt={quickViewProduct.name} className="w-full h-auto max-h-[400px] object-contain mix-blend-multiply" />
            </div>
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.orange }}>{quickViewProduct.category}</div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.purple }}>{quickViewProduct.name}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed line-clamp-4">{quickViewProduct.desc}</p>
              {quickViewProduct.features && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Caractéristiques :</h4>
                  <ul className="space-y-2">
                    {quickViewProduct.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                         <span className="text-orange-500 mt-0.5">•</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button onClick={() => { setQuickViewProduct(null); onProductClick(quickViewProduct); }} className="w-full py-4 text-white font-bold rounded-xl mt-4 hover:opacity-90 transition-opacity" style={{ backgroundColor: colors.purple }}>
                Voir les détails complets
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

const ProductDetails = ({
  product,
  allProducts = [],
  onProductSelect,
  onBack,
}: {
  product: any;
  allProducts?: any[];
  onProductSelect?: (product: any) => void;
  onBack: () => void;
}) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an email or save to DB
    alert('Votre demande a été envoyée avec succès !');
    setShowContactForm(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white min-h-screen relative">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#F37517] transition-colors mb-8 font-medium"
      >
        <ArrowRight size={20} className="rotate-180" /> Retour aux produits
      </button>

      {/* Modal Contact Form */}
      {showContactForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F4F0F8]">
              <h3 className="text-xl font-bold text-[#2A1659]">Demander plus d'info</h3>
              <button 
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                <input 
                  type="text" 
                  value={product.name}
                  disabled 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none transition-all"
                  placeholder="Votre nom"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none transition-all"
                    placeholder="0535 450 045"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF570A] outline-none transition-all resize-none"
                  placeholder="Bonjour, je souhaiterais avoir plus d'informations concernant ce produit..."
                />
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3 px-6 text-white font-bold rounded-xl transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20"
                  style={{ backgroundColor: colors.orange }}
                >
                  Envoyer la demande
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Image side */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-[30px] flex items-center justify-center border border-gray-100 aspect-square overflow-hidden">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply drop-shadow-xl"
            />
          </div>
        </div>

        {/* Content side */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              className="text-sm font-bold uppercase tracking-wider mb-3"
              style={{ color: colors.orange }}
            >
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#2A1659]">
              {product.name}
            </h1>

            {product.features && product.features.length > 0 && (
              <div className="bg-[#F4F0F8] rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-[#2A1659] mb-4 text-lg">
                  Caractéristiques
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feat: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 font-medium"
                    >
                      <CheckCircle
                        size={20}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: colors.orange }}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => setShowContactForm(true)}
                className="flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 shadow-xl shadow-orange-500/20 text-lg w-full sm:w-auto"
                style={{ backgroundColor: colors.orange }}
              >
                Demander plus d'info
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
              <span className="text-gray-500 font-medium">Partager :</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#1877F2] hover:text-white transition-colors"
                  title="Partager sur Facebook"
                >
                  <Facebook size={18} />
                </button>
                <button 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent("Découvrez " + (product?.name || "ce produit") + " chez Simaflex : " + window.location.href)}`, '_blank')}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#25D366] hover:text-white transition-colors"
                  title="Partager sur WhatsApp"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 0C5.385 0 0 5.388 0 12.036c0 2.115.548 4.184 1.584 6L.06 24l6.115-1.602A11.95 11.95 0 0 0 12.031 24c6.643 0 12.036-5.388 12.036-12.036C24.067 5.318 18.675 0 12.031 0zm.013 20.007a9.92 9.92 0 0 1-5.111-1.42l-.367-.217-3.805.998.995-3.71-.24-.38a9.96 9.96 0 0 1-1.524-5.263c0-5.512 4.484-9.992 9.994-9.992 5.514 0 10.001 4.478 10.001 9.998 0 5.517-4.485 9.99-9.99 9.99l.047-.004zm5.405-7.464c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.149-.668.149-.198.297-.768.967-.94 1.165-.173.198-.347.223-.644.074-1.282-.648-2.316-1.196-3.21-2.74-.23-.393-.024-.606.126-.754.133-.133.297-.347.445-.52.148-.174.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.149-.668-1.609-.915-2.203-.242-.58-.487-.502-.668-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.371-.272.297-1.04 1.015-1.04 2.476s1.064 2.871 1.213 3.069c.149.198 2.093 3.196 5.074 4.481.71.306 1.264.488 1.695.625.713.227 1.36.195 1.87.118.572-.086 1.758-.718 2.006-1.411.248-.693.248-1.287.173-1.411-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent("Découvrez ce produit: " + (product?.name || ""))}&body=${encodeURIComponent("Regardez ce produit chez Simaflex : " + window.location.href)}`}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
                  title="Partager par Email"
                >
                  <Mail size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {(product.fullDesc || product.desc) && (
        <div className="mt-16 border-t border-gray-100 pt-16">
          <h2 className="text-2xl font-bold mb-6 text-[#2A1659]">À propos de {product.name}</h2>
          <div 
            className="text-gray-700 text-lg leading-relaxed prose max-w-none w-full"
            dangerouslySetInnerHTML={{ __html: product.fullDesc || product.desc || '' }}
          />
        </div>
      )}

      {allProducts && allProducts.filter((p: any) => p.category === product.category && p.id !== product.id).length > 0 && (
        <div className="mt-20 border-t border-gray-100 pt-16 mb-8 relative group/carousel">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: colors.purple }}>
            Vous aimerez aussi
          </h2>
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {allProducts
              .filter((p: any) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct: any) => (
                <div 
                  key={relatedProduct.id} 
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(25%-18px)] snap-start bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-w-0"
                  onClick={() => onProductSelect && onProductSelect(relatedProduct)}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img 
                      src={relatedProduct.img || relatedProduct.image} 
                      alt={relatedProduct.name} 
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-bold tracking-wider mb-2" style={{ color: colors.orange }}>
                      {relatedProduct.category.toUpperCase()}
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-orange-500 transition-colors" style={{ color: colors.purple }}>
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {relatedProduct.desc}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const customMarkerIcon = L.divIcon({
  className: 'bg-transparent border-none',
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width: 18px; height: 24px; filter: drop-shadow(0px 2px 3px rgba(0,0,0,0.3)); transform-origin: bottom center; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
      <path fill="${colors.orange}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"/>
    </svg>
  `,
  iconSize: [18, 24],
  iconAnchor: [9, 24],
  popupAnchor: [0, -24]
});

const StoreLocator = () => {
  const defaultStores = [
    {
      title: "Meknes",
      position: [33.83837, -5.52123] as [number, number],
      address: "Km 7,3 Route D'El hajeb Mejjat Meknes",
    },
    {
      title: "Meknes",
      position: [33.84951, -5.53345] as [number, number],
      address: "8 Zone Industrielle Sidi Bouzekri Meknes",
    },
    {
      title: "Temara",
      position: [33.92396, -6.89005] as [number, number],
      address: "Avenue Ibn Khaldoun Temara",
    },
    {
      title: "Khribga",
      position: [32.88533, -6.91318] as [number, number],
      address: "Rue Al Hammam khribga",
    },
    {
      title: "Meknes",
      position: [33.89757, -5.5707] as [number, number],
      address: "Bab Jdid Lemdina Meknes Maroc",
    },
    {
      title: "Agadir",
      position: [30.36323, -9.53602] as [number, number],
      address: "Avenue Mohamed V al Hay Hassani  Inzegane Agadir",
    },
    {
      title: "Samara",
      position: [26.74198, -11.67243] as [number, number],
      address: "Es-semara, Avenue Mohamed V, Smara, Maroc",
    },
    {
      title: "Taroudant",
      position: [30.46864, -8.87897] as [number, number],
      address: "Boulevard Mohammed V Taroudant",
    },
    {
      title: "Taroudant",
      position: [30.47084, -8.87969] as [number, number],
      address: "Avenue Bir Anzarane Tadjount Taroudant",
    },
    {
      title: "TanTan",
      position: [28.43872, -11.10989] as [number, number],
      address: "Boulevard 20 Août TanTan",
    },
    {
      title: "Agadir",
      position: [30.38324, -9.52357] as [number, number],
      address: "Rue Essaouira Tassila Agadir",
    },
    {
      title: "Agadir",
      position: [30.33539, -9.50076] as [number, number],
      address: "Agdal 2 Ait Melloul Agadir",
    },
    {
      title: "Errachidia",
      position: [31.92888, -4.44112] as [number, number],
      address: "Boulevard Mphamed 6 Rue , Errachidia, Maroc",
    },
    {
      title: "Fes",
      position: [34.01663, -4.98594] as [number, number],
      address: "Avenue Al Karama fes , Maroc",
    },
    {
      title: "Khemissat",
      position: [33.82913, -6.07097] as [number, number],
      address: "Rue Lalla LYakout Khemisset",
    },
    {
      title: "Sidi Slimane",
      position: [34.25717, -5.93082] as [number, number],
      address: "Avenu Mohamed V Sidi Slimane, Maroc",
    },
    {
      title: "Rabat",
      position: [33.98273, -6.8142] as [number, number],
      address: "Hay Atakadoum Rabat",
    },
    {
      title: "Temara",
      position: [33.91125, -6.91568] as [number, number],
      address: "avenue Abdelkrim El Khatabi Temara, Maroc",
    },
    {
      title: "Laaraiche",
      position: [35.19635, -6.15432] as [number, number],
      address: "Avenue Moulay Isamil, Larache, Maroc",
    },
    {
      title: "Marrakech",
      position: [31.62242, -8.05861] as [number, number],
      address: "Avenue Laayoune , Marrakesh,Maroc",
    },
    {
      title: "Casablanca",
      position: [33.6028, -7.46246] as [number, number],
      address: "Tit Mellil Casablanca Maroc",
    },
    {
      title: "Casablanca",
      position: [33.60453, -7.51058] as [number, number],
      address: "Boulevard Souhaib Arroumi Sidi bernoussi Casablanca, Maroc",
    },
    {
      title: "Salé",
      position: [34.07006, -6.77589] as [number, number],
      address: "Avenue Mohamed V Sale",
    },
    {
      title: "Salé",
      position: [34.04707, -6.78682] as [number, number],
      address: "Hay Essalam Sale",
    },
    {
      title: "Salé",
      position: [34.06144, -6.79396] as [number, number],
      address: "Avenue Ali Abi Taleb Hay Errahma Sale",
    },
    {
      title: "Salé",
      position: [34.05166, -6.79094] as [number, number],
      address: "Avenue Assalam Sale",
    },
    {
      title: "Beni Mellal",
      position: [32.33774, -6.34533] as [number, number],
      address: "Avenue Bourkia , Beni Mellal, Maroc",
    },
    {
      title: "Tanger",
      position: [35.77211, -5.82182] as [number, number],
      address: "Avenue Haroun Errachid, Charf-Souani Tanger",
    },
    {
      title: "Tinjdad",
      position: [31.50575, -5.03616] as [number, number],
      address: "Zenkat Nakhil Tinejdad Maroc",
    },
    {
      title: "El Jadida",
      position: [33.24604, -8.52457] as [number, number],
      address: "Avenue Al Moujahid Al Ayachi El Jadida Maroc",
    },
    {
      title: "Rabat",
      position: [33.92605, -6.90511] as [number, number],
      address: "Avenue Allal Ben Abdellah  , Temara Maroc",
    },
    {
      title: "Casablanca",
      position: [33.57004, -7.63068] as [number, number],
      address: "Derb Ghallef, Boulevard Anwal,, Casablanca",
    },
    {
      title: "Casablanca",
      position: [33.54225, -7.58338] as [number, number],
      address: "Rue 232 Hay Moulay Abdellah Casablanca",
    },
    {
      title: "Essaouira",
      position: [31.50997, -9.76497] as [number, number],
      address: "Avenue Al Akouasse , Essaouira Maroc",
    },
    {
      title: "Temara",
      position: [33.92335, -6.89649] as [number, number],
      address: "Temara Rue Ibn Roched Temara, Maroc",
    },
    {
      title: "Tifelt",
      position: [33.89057, -6.32017] as [number, number],
      address: "Avenue youssef ibn tachafine tifelt Maroc",
    },
    {
      title: "Tetouan",
      position: [35.57799, -5.39104] as [number, number],
      address: "Avenue Bilal Ibn Rabah, Medina, Tétouan,Maroc",
    },
    {
      title: "Safi",
      position: [32.29552, -9.2428] as [number, number],
      address: "Rue Abdelmoumen Ben Ali , Safi , Maroc",
    },
    {
      title: "Belksiri",
      position: [34.57393, -5.96064] as [number, number],
      address: "Avenue des Forces Royales Mechra Bel Ksiri, Maroc",
    },
    {
      title: "Karya",
      position: [34.02449, -6.76542] as [number, number],
      address: "Avenue Moulay Abdellah Al Karya",
    },
    {
      title: "Salé",
      position: [34.05879, -6.78213] as [number, number],
      address: "Avenue Boukraa Sale ",
    },
    {
      title: "Temara",
      position: [33.92564, -6.90458] as [number, number],
      address: "Avenue Allal Ben Abdellah ,Temara, Maroc",
    },
    {
      title: "Salé",
      position: [34.05496, -6.82006] as [number, number],
      address: "Rue 14 Avenue Marmoucha Sidi Moussa Sale",
    },
    {
      title: "Youssoufia",
      position: [32.28294, -8.49854] as [number, number],
      address: "Rue 201 Hay Essalam Youssoufia, Maroc",
    },
    {
      title: "Khenifra",
      position: [32.94206, -5.67545] as [number, number],
      address: "Hay Hassan 2 Khenifra",
    },
    {
      title: "Agadir",
      position: [30.41602, -9.57341] as [number, number],
      address: "Avenue Kadi Ayad Amsernate Agadir",
    },
    {
      title: "Fkih Ben Saleh",
      position: [32.49513, -6.68578] as [number, number],
      address:
        "à proximité de la pharmacie Ouled Hdidou , Fkih Ben Salah, Maroc",
    },
    {
      title: "Tinghir",
      position: [31.52038, -5.52969] as [number, number],
      address: "Rue Hassan II",
    },
    {
      title: "Imzouren",
      position: [35.17521, -3.85101] as [number, number],
      address:
        "Route de l'aeroport d'Al hoceima Ait Youssef Ou Ali, , Al Hoceima Province, Maroc",
    },
    {
      title: "Rabat",
      position: [33.98227, -6.88333] as [number, number],
      address: "Avenue Al Lzdihar Rabat , Maroc",
    },
    {
      title: "Rabat",
      position: [34.0084, -6.85942] as [number, number],
      address: "Avenue Regragui Al Akkari Rabat",
    },
    {
      title: "Rabat ",
      position: [33.97897, -6.81903] as [number, number],
      address: "Hay Nahda Rue Zouara rabat",
    },
    {
      title: "BAB TAZA",
      position: [35.06297, -5.19094] as [number, number],
      address: "N2, Bab Taza Maroc",
    },
    {
      title: "Mediak",
      position: [35.68345, -5.32615] as [number, number],
      address: "Avenue Tetouan M'diq, Maroc",
    },
    {
      title: "Oujda",
      position: [34.6832777, -1.9082918] as [number, number],
      address: "avenue sidi Driss, Oujda,Maroc",
    },
    {
      title: "Temara",
      position: [33.9111187, -6.9434841] as [number, number],
      address: "Rue Ibn Ghazi hay al masira Temara",
    },
    {
      title: "Guersif",
      position: [34.2980467, -3.3467075] as [number, number],
      address: "Avenue Moulay Hassan Guercif,Maroc",
    },
    {
      title: "Taourirt",
      position: [34.3983471, -2.9033931] as [number, number],
      address: "Rue Melilla Taourirt, Maroc",
    },
    {
      title: "Berkane",
      position: [34.9443528, -2.3074077] as [number, number],
      address: "Boulevard Al Wifak Tahtaha, Berkane,Maroc",
    },
    {
      title: "El Hajeb",
      position: [33.69355, -5.37271] as [number, number],
      address: "à proximité de pharmacie Ain khadem Lhajeb",
    },
    {
      title: "Berchid",
      position: [33.27433, -7.57782] as [number, number],
      address: "Avenue Mouna, Berrechid",
    },
    {
      title: "Lalla Mimouna",
      position: [34.84669, -6.07008] as [number, number],
      address: "Lalla Mimouna,Maroc",
    },
    {
      title: "Jarf Lmlha",
      position: [34.4921, -5.51289] as [number, number],
      address:
        "Route N 13 à proximité de art de la publicité  Jorf El Melha, Maroc",
    },
    {
      title: "Demnate",
      position: [31.73114, -6.9995] as [number, number],
      address: "Rue 307 à proximite de cafe rajae Demnate",
    },
    {
      title: "Ksar El Kebir",
      position: [34.99828, -5.89979] as [number, number],
      address: "Cash plus Mérina  parc ksar el kebir",
    },
    {
      title: "Kenitra",
      position: [34.25751, -6.62187] as [number, number],
      address: "à proximité de parapharmacie  ouled oujih , Kenitra, Maroc",
    },
    {
      title: "Zaio",
      position: [34.9409, -2.72892] as [number, number],
      address: "Bouhaddouz Zaio, Maroc",
    },
    {
      title: "Asilah",
      position: [35.45484, -6.04] as [number, number],
      address: "Avenue Rabat Asilah, Maroc",
    },
    {
      title: "Bouhmed",
      position: [35.31241, -4.96521] as [number, number],
      address: "Route National 16 Bouhmed , Stehat Maroc",
    },
    {
      title: "Oued Law",
      position: [35.44683, -5.09381] as [number, number],
      address: "Oued Laou,Maroc",
    },
    {
      title: "Rabat",
      position: [33.93652, -6.9005] as [number, number],
      address: "Rabat",
    },
    {
      title: "Azilal",
      position: [31.96755, -6.57176] as [number, number],
      address: "Azilal",
    },
    {
      title: "Guelmim",
      position: [28.98219, -10.05745] as [number, number],
      address: "Guelmim",
    },
    {
      title: "Laayoune",
      position: [27.13012, -13.19455] as [number, number],
      address: "Laayoune,Maroc",
    },
    {
      title: "Tamsamane ",
      position: [35.10638, -3.61412] as [number, number],
      address: "Ouchanen , Tamsamane Al Hoceima",
    },
    {
      title: "Zagoura",
      position: [30.34298, -5.84134] as [number, number],
      address: "Zagora, Maroc",
    },
    {
      title: "Casablanca",
      position: [33.59347, -7.51012] as [number, number],
      address: "Sidi Moumen , Casablanca",
    },
    {
      title: "Khenifra",
      position: [32.93754, -5.66603] as [number, number],
      address: "Khenifra,Maroc",
    },
    {
      title: "Mrirt",
      position: [33.16659, -5.56597] as [number, number],
      address: "Route N 24 M'Rirt",
    },
    {
      title: "Nador",
      position: [35.17656, -2.95988] as [number, number],
      address: "Nador,Olad Botaib",
    },
    {
      title: "Ouazzane",
      position: [34.805, -5.5737] as [number, number],
      address: "Ouazzane,Maroc",
    },
    {
      title: "Ain Dorij",
      position: [34.6162, -5.28882] as [number, number],
      address: "ain Dorij ",
    },
    {
      title: "Azrou",
      position: [33.4375, -5.22047] as [number, number],
      address: "a proximité de pharmacie Moyen Atlas Azrou",
    },
    {
      title: "Oulmes",
      position: [33.4322, -6.0015] as [number, number],
      address: "Oulmes, Maroc",
    },
    {
      title: "Goulmima",
      position: [31.69069, -4.95681] as [number, number],
      address: " Goulmima, Maroc",
    },
    {
      title: "Mrirte",
      position: [35.68345, -5.56861] as [number, number],
      address: "M'Rirt,Maroc",
    },
  ];

  const stores = defaultStores;

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStores = stores.filter(store => 
    store.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (store.address && store.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <SectionTitle title="Nos points de vente" />
      <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
        Découvrez nos produits près de chez vous. Consultez la carte pour
        trouver nos points de vente dans tout le Maroc.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="bg-[#F4F0F8] p-6 rounded-2xl h-[400px] lg:h-[600px] flex flex-col">
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: colors.purple }}
            >
              Liste des revendeurs ({filteredStores.length})
            </h3>

            <div className="mb-4 relative">
              <input 
                 type="text" 
                 placeholder="Rechercher une ville ou adresse..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
               />
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {filteredStores.map((store, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-orange-300 transition-colors"
                >
                  <h4 className="font-bold text-gray-900 mb-1">
                    Simaflex {store.title}
                  </h4>
                  {store.address ? (
                    <>
                      {store.address && (
                        <p className="text-sm text-gray-500 mb-2">
                          {store.address}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      Aucune information supplémentaire
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 h-[600px] lg:h-[800px] rounded-2xl overflow-hidden shadow-lg relative z-10">
          <MapContainer
            center={[28.7917, -7.0926]}
            zoom={6}
            minZoom={6}
            maxBounds={[
              [20.7665, -18.0], // South-West
              [36.0, -0.9984]   // North-East
            ]}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=m&hl=fr&gl=MA&x={x}&y={y}&z={z}"
            />
            {filteredStores.map((store: any, idx) => (
              <Marker key={idx} position={store.position} icon={customMarkerIcon}>
                <Popup>
                  <strong style={{ color: colors.purple, fontSize: '1.1em' }}>Simaflex {store.title}</strong>
                  <br />
                  {store.address && (
                    <span className="block mt-2 text-gray-700">
                      <strong>Adresse:</strong> {store.address}
                    </span>
                  )}
                  <span className="block mt-1 text-gray-600">
                    <strong>Horaires:</strong> Lundi-Samedi: 9h00 - 19h00
                  </span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

type Route = 'home' | 'store_locator' | 'product_details' | 'about' | 'blog' | 'contact' | 'legal' | 'privacy' | 'admin';

const AboutPage = () => {
  return (
    <div className="pt-32 pb-20 bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6" style={{ backgroundColor: colors.lightPurple, color: colors.purple }}>
              Notre Histoire
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight" style={{ color: colors.purple }}>
              L'art du <span style={{ color: colors.orange }}>sommeil parfait</span> depuis plus de 20 ans.
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Fondée avec la conviction qu'un bon sommeil est la fondation d'une vie saine et épanouie, Simaflex s'est donnée pour mission d'innover continuellement pour vous offrir le confort ultime. Nous allions savoir-faire artisanal et technologies de pointe pour créer des produits de literie d'exception.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-black mb-1" style={{ color: colors.orange }}>20+</p>
                <p className="text-gray-500 text-sm font-medium">Années d'expérience</p>
              </div>
              <div>
                <p className="text-3xl font-black mb-1" style={{ color: colors.orange }}>15k+</p>
                <p className="text-gray-500 text-sm font-medium">Clients satisfaits</p>
              </div>
              <div>
                <p className="text-3xl font-black mb-1" style={{ color: colors.orange }}>100%</p>
                <p className="text-gray-500 text-sm font-medium">Fabrication locale</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 rounded-3xl opacity-50 blur-lg" style={{ backgroundColor: colors.lightPurple }}></div>
            <img 
              src="https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80" 
              alt="Artisan travaillant sur un matelas" 
              className="relative rounded-3xl shadow-2xl object-cover w-full h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-gray-50 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <SectionTitle title="Notre Mission & Nos Valeurs" />
            <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
              Chaque jour, nous nous engageons à améliorer la qualité de votre repos à travers des valeurs fortes qui guident toutes nos actions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: colors.lightPurple, color: colors.purple }}>
                <Star size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.purple }}>Exigence de Qualité</h3>
              <p className="text-gray-600 leading-relaxed">
                Nous sélectionnons rigoureusement des matériaux premium et appliquons des contrôles stricts à chaque étape de fabrication pour garantir une durabilité exceptionnelle.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFF0E6', color: colors.orange }}>
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.purple }}>Le Confort Avant Tout</h3>
              <p className="text-gray-600 leading-relaxed">
                Le bien-être n'est pas une option. Nos designs sont pensés ergonomiquement pour épouser les formes de votre corps et soulager les points de pression.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: colors.lightPurple, color: colors.purple }}>
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.purple }}>Engagement Durable</h3>
              <p className="text-gray-600 leading-relaxed">
                Soucieux de notre impact, nous privilégions des procédés respectueux de l'environnement et concevons des produits faits pour durer, réduisant ainsi le gaspillage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: colors.purple }}>Notre Engagement envers vous</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Chez Simaflex, nous ne vendons pas simplement des matelas, nous vous offrons la promesse de nuits réparatrices. Nous comprenons que l'achat d'une literie est un investissement important pour votre santé.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 size={24} style={{ color: colors.orange }} />
                <span>Garantie prolongée sur tous nos matelas</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 size={24} style={{ color: colors.orange }} />
                <span>Service client réactif et à l'écoute</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 size={24} style={{ color: colors.orange }} />
                <span>Livraison soignée et installation possible</span>
              </li>
            </ul>
          </div>
          <div className="md:w-1/2 bg-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80" 
              alt="Personne dormant paisiblement" 
              className="w-full h-full object-cover min-h-[400px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const BlogSection = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [firebaseArticles, setFirebaseArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const articlesList = querySnapshot.docs.map(doc => {
           const data = doc.data();
           let img = data.image;
           
           // Fix for DEV images saved in Firestore returning 404 in PROD
           if (img && typeof img === 'string' && img.startsWith('/src/assets/')) {
               const filenameMatch = img.match(/\/([^\/]+)\.[a-z0-9]+$/i);
               if (filenameMatch) {
                   const filenamePrefix = filenameMatch[1];
                   const localArticle = blogArticles.find(a => a.image && typeof a.image === 'string' && a.image.includes(filenamePrefix));
                   if (localArticle) {
                       img = localArticle.image; // Use the properly bundled Vite asset URL
                   }
               }
           }
           
           return {
             id: doc.id,
             ...data,
             image: img
           };
        });
        if (articlesList.length > 0) {
           setFirebaseArticles(articlesList);
        } else {
           setFirebaseArticles(blogArticles);
        }
      } catch (error) {
        setFirebaseArticles(blogArticles);
        console.error("Error fetching articles", error);
      }
    };
    fetchArticles();
  }, []);

  if (selectedArticle) {
    return (
      <div className="pt-32 pb-20 bg-white min-h-screen">
        <SEO 
          title={`${selectedArticle.title} - Blog Simaflex`}
          description={selectedArticle.excerpt}
          image={selectedArticle.image}
          keywords="blog, sommeil, matelas, simaflex, literie"
          schema={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": selectedArticle.title,
            "image": selectedArticle.image,
            "description": selectedArticle.excerpt,
            "author": {
              "@type": "Organization",
              "name": "Simaflex"
            }
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-[#2A1659] mb-8 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Retour aux articles
          </button>
          
          <img 
            src={selectedArticle.image} 
            alt={selectedArticle.title} 
            className="w-full h-[400px] object-cover rounded-3xl mb-10 shadow-lg"
          />
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#2A1659] leading-tight">
            {selectedArticle.title}
          </h1>
          
          <div 
            className="prose prose-lg max-w-none text-gray-700
              prose-headings:text-[#2A1659] prose-h2:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:leading-relaxed prose-p:mb-6
              prose-li:marker:text-[#FF570A] prose-strong:text-[#2A1659]"
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionTitle title="Conseils Sommeil" />
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Retrouvez nos articles, astuces et conseils techniques pour améliorer la qualité de votre sommeil et choisir la literie parfaitement adaptée à vos besoins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {firebaseArticles.map((article) => (
            <div 
              key={article.id} 
              className="bg-white rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-[#2A1659] group-hover:text-[#FF570A] transition-colors leading-tight line-clamp-3">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-1 line-clamp-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center text-[#FF570A] font-semibold mt-auto group-hover:translate-x-2 transition-transform">
                  Lire l'article
                  <ChevronRight size={20} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title, content }: { title: string, content?: string }) => (
  <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white min-h-[60vh] flex flex-col items-center justify-center text-center">
    <SectionTitle title={title} />
    <p className="max-w-2xl text-gray-600 mt-6 text-lg">{content || "Cette page est en cours de construction. Revenez bientôt pour plus d'informations."}</p>
  </div>
);



export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>("home");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Matelas");
  const [firebaseProducts, setFirebaseProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => {
           const d = doc.data();
           return {
             id: doc.id,
             name: d.title || d.name,
             desc: d.subtitle || d.desc,
             img: resolveProductImage(d.title || d.name || "", d.image || d.img),
             ...d
           };
        });
        if (productsList.length > 0) {
           setFirebaseProducts(productsList);
        } else {
           setFirebaseProducts(productsData.map(p => ({...p, img: resolveProductImage(p.name, p.img)})));
        }
      } catch (error) {
        setFirebaseProducts(productsData.map(p => ({...p, img: resolveProductImage(p.name, p.img)})));
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentRoute !== "home") {
      window.scrollTo(0, 0);
    }
  }, [currentRoute, selectedProduct]);

  const handleRouteChange = (route: Route, category?: string, product?: any) => {
    setCurrentRoute(route);
    
    // Update URL for SEO and history
    let path = "/";
    if (route === "product_details" && product) {
       path = `/${(product.category || "produit").toLowerCase()}/${product.name.toLowerCase().replace(/\s+/g, '-')}`;
    } else if (route === "home" && category) {
       path = `/${category.toLowerCase()}`;
    } else if (route !== "home") {
       path = `/${route}`;
    }
    
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    
    if (route === "product_details" && product) {
       setSelectedProduct(product);
       window.scrollTo(0, 0);
    } else if (category) {
      setActiveCategory(category);
      setTimeout(() => {
        const catalogEl = document.getElementById("product-catalog");
        if (catalogEl) {
          const yOffset = -100;
          const y = catalogEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const validRoutes = ["about", "store_locator", "blog", "contact", "admin", "legal", "privacy", "product_details"];
      const categoryRoutes = ["matelas", "salons", "accessoires"];
      
      if (pathSegments.length === 0) {
        setCurrentRoute("home");
      } else if (validRoutes.includes(pathSegments[0])) {
        setCurrentRoute(pathSegments[0] as Route);
      } else if (categoryRoutes.includes(pathSegments[0].toLowerCase())) {
        const cat = pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1).toLowerCase();
        
        if (pathSegments.length === 2 && firebaseProducts.length > 0) {
            const productSlug = pathSegments[1];
            const foundProduct = firebaseProducts.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === productSlug || p.id === productSlug);
            if (foundProduct) {
                setSelectedProduct(foundProduct);
                setCurrentRoute("product_details");
            } else {
                setCurrentRoute("home");
                setActiveCategory(cat);
            }
        } else {
            setCurrentRoute("home");
            setActiveCategory(cat);
            setTimeout(() => {
              const catalogEl = document.getElementById("product-catalog");
              if (catalogEl) {
                const yOffset = -100;
                const y = catalogEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
              }
            }, 300);
        }
      } else {
        setCurrentRoute("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    const initialPathSegments = window.location.pathname.split('/').filter(Boolean);
    if (firebaseProducts.length > 0 || initialPathSegments.length < 2) {
       handlePopState();
    }
    return () => window.removeEventListener("popstate", handlePopState);
  }, [firebaseProducts]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#F37517] selection:text-white">
      <Navbar
        currentRoute={currentRoute}
        onChangeRoute={handleRouteChange}
      />
      {currentRoute === "product_details" && selectedProduct ? (
        <>
          <SEO 
            title={`Simaflex - ${selectedProduct.name}`}
            description={selectedProduct.desc.substring(0, 150)}
            image={selectedProduct.img || selectedProduct.image}
            keywords={`matelas, ${selectedProduct.category}, simaflex, literie maroc`}
            schema={{
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": selectedProduct.name,
              "image": selectedProduct.img || selectedProduct.image,
              "description": selectedProduct.desc,
              "brand": {
                "@type": "Brand",
                "name": "Simaflex"
              }
            }}
          />
          <ProductDetails
            product={selectedProduct}
            allProducts={firebaseProducts}
            onProductSelect={(product) => handleRouteChange("product_details", undefined, product)}
            onBack={() => setCurrentRoute("home")}
          />
        </>
      ) : currentRoute === "store_locator" ? (
        <>
          <SEO 
            title="Points de vente - Simaflex" 
            description="Trouvez les magasins et points de vente Simaflex les plus proches de chez vous au Maroc." 
            keywords="magasins simaflex, points de vente literie, acheter matelas maroc"
          />
          <StoreLocator />
        </>
      ) : currentRoute === "about" ? (
        <>
          <SEO 
            title="À propos - Simaflex" 
            description="Découvrez l'histoire de Simaflex, leader de la literie et du confort au Maroc depuis plusieurs années." 
            keywords="histoire simaflex, fabricant literie maroc, confort, qualité"
          />
          <AboutPage />
        </>
      ) : currentRoute === "blog" ? (
        <>
          <SEO 
            title="Blog & Conseils - Simaflex" 
            description="Lisez nos derniers articles et conseils pour améliorer votre sommeil et bien choisir votre literie." 
            keywords="blog sommeil, conseils literie, bien dormir, guide d'achat matelas"
          />
          <BlogSection />
        </>
      ) : currentRoute === "contact" ? (
        <div className="pt-32 pb-20 max-w-7xl mx-auto min-h-screen">
          <SEO 
            title="Contact - Simaflex" 
            description="Contactez-nous pour toute question, demande de renseignements ou réclamation." 
            keywords="contact simaflex, service client literie, réclamation matelas"
          />
          <SectionTitle title="Contactez-nous" />
          <p className="text-center text-gray-600 mb-10 -mt-6">Notre équipe est à votre disposition pour toute question ou demande de renseignements.</p>
          <ContactBanner onChangeRoute={(route) => handleRouteChange(route as any)} />
        </div>
      ) : currentRoute === "admin" ? (
        <>
          <SEO title="Administration - Simaflex" description="Espace d'administration." />
          <AdminDashboard />
        </>
      ) : currentRoute === "legal" ? (
        <>
          <SEO title="Mentions légales - Simaflex" description="Informations juridiques, propriété intellectuelle et conditions d'utilisation." />
          <PlaceholderPage title="Mentions légales" content="Informations juridiques, propriété intellectuelle, cookies et conditions d'utilisation." />
        </>
      ) : currentRoute === "privacy" ? (
        <>
          <SEO title="Politique de confidentialité - Simaflex" description="Notre politique concernant la protection de vos données personnelles." />
          <PlaceholderPage title="Politique de confidentialité" content="Nous prenons la protection de vos données personnelles très au sérieux. (Page en construction)" />
        </>
      ) : (
        <>
          <SEO 
            title={window.location.pathname !== '/' ? `Simaflex - Collection ${activeCategory}` : "Simaflex - Matelas au Maroc - Qualité et Confort"}
            description={window.location.pathname !== '/' ? `Découvrez notre collection de ${activeCategory.toLowerCase()} Simaflex au Maroc. Qualité, confort et durabilité.` : "Simaflex propose une large gamme de matelas, salons et accessoires de confort au Maroc. Découvrez notre savoir-faire unique."}
            keywords={`matelas maroc, literie de qualité, simaflex, achat matelas casablanca${activeCategory ? ', ' + activeCategory.toLowerCase() : ''}`}
            schema={{
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Simaflex",
              "url": "https://simaflex.ma",
              "logo": "https://simaflex.ma/simaflex-logo-color.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "0535 450 045",
                "contactType": "customer service"
              }
            }}
          />
          <Hero onChangeRoute={handleRouteChange} />
          <FeaturesCards />
          <Universes />
          <ProductCatalog
            products={firebaseProducts}
            onProductClick={(p) => { handleRouteChange("product_details", undefined, p); }} 
            activeCategory={activeCategory}
            onCategoryChange={(cat) => handleRouteChange("home", cat)}
          />
          <FeaturedProduct onDiscover={() => {
            const medicaZoneProd = firebaseProducts.find(p => p.id === "medicazone");
            if (medicaZoneProd) {
              handleRouteChange("product_details", undefined, medicaZoneProd);
            }
          }} />
          <WhyChooseUs />
          <Testimonials />
          <ContactBanner onChangeRoute={(route) => handleRouteChange(route as any)} />
        </>
      )}
      <Footer onChangeRoute={setCurrentRoute} />
    </div>
  );
}
