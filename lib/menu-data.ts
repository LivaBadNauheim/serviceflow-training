// Trainings-Daten – übernommen aus der echten Liva-Speisekarte (liva-bad-nauheim/lib/menu-data.ts).
// Nur Name, Preis und Gruppe, ohne Beschreibungen/Allergene – für die Kassen-Simulation reicht das.

export type PosItem = {
  id: string
  name: string
  preis: number
  gruppe: 'essen' | 'trinken'
  kategorie: string
}

export const items: PosItem[] = [
  {
    "id": "item-1",
    "name": "Smashed Avo Brot",
    "preis": 7.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-2",
    "name": "Shakshuka",
    "preis": 10.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-3",
    "name": "Shakshuka (vegan)",
    "preis": 10,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-4",
    "name": "Egg Drop Lachs",
    "preis": 10.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-5",
    "name": "Egg Drop Cheddar",
    "preis": 9,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-6",
    "name": "Egg Drop Sucuk",
    "preis": 10.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-7",
    "name": "Rührei pur",
    "preis": 7,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-8",
    "name": "Rührei mit Feta und Tomate",
    "preis": 8,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-9",
    "name": "Rührei Sucuk",
    "preis": 9,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-10",
    "name": "Croissant",
    "preis": 4.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-11",
    "name": "Joghurt mit Früchten",
    "preis": 9,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-12",
    "name": "Knuspermüsli mit Joghurt und Früchten",
    "preis": 10.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-13",
    "name": "French Toast",
    "preis": 12,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-14",
    "name": "LIVA-Frühstück",
    "preis": 11.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-15",
    "name": "Mediterran",
    "preis": 12.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-16",
    "name": "Vegan",
    "preis": 12,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-17",
    "name": "Prosecco-Frühstück für 2",
    "preis": 32,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-18",
    "name": "Weizenbrötchen",
    "preis": 1.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-19",
    "name": "Dinkelbrötchen",
    "preis": 2,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-20",
    "name": "Scheibe Landbrot",
    "preis": 2,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-21",
    "name": "Scheibe glutenfreies Brot",
    "preis": 1,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-22",
    "name": "Croissant",
    "preis": 3,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-23",
    "name": "Portion Gouda",
    "preis": 2.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-24",
    "name": "Portion Feta",
    "preis": 2.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-25",
    "name": "Portion Brie",
    "preis": 2.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-26",
    "name": "Portion Salami",
    "preis": 5.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-27",
    "name": "Portion Butter",
    "preis": 1.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-28",
    "name": "Portion Marmelade",
    "preis": 1.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-29",
    "name": "Portion Honig",
    "preis": 1.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-30",
    "name": "Portion Frischkäse",
    "preis": 1.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-31",
    "name": "Portion Nutella",
    "preis": 1.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-32",
    "name": "Portion veganer Feta",
    "preis": 2.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-33",
    "name": "Portion veganer Aufstrich",
    "preis": 2.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-34",
    "name": "Portion Hummus",
    "preis": 2.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-35",
    "name": "Portion Oliven",
    "preis": 3,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-36",
    "name": "Portion Cherry Tomaten",
    "preis": 3,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-37",
    "name": "½ Avocado",
    "preis": 2.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-38",
    "name": "Portion Räucherlachs",
    "preis": 3.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-39",
    "name": "Portion Sucuk",
    "preis": 4.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-40",
    "name": "Portion Rührei",
    "preis": 4.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-41",
    "name": "Portion Rührei mit Feta & Tomate",
    "preis": 6,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-42",
    "name": "1 Spiegelei",
    "preis": 2.5,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-43",
    "name": "2 Spiegeleier",
    "preis": 4,
    "gruppe": "essen",
    "kategorie": "Frühstück"
  },
  {
    "id": "item-44",
    "name": "Beilagensalat",
    "preis": 6,
    "gruppe": "essen",
    "kategorie": "Salate"
  },
  {
    "id": "item-45",
    "name": "Caprese",
    "preis": 12.5,
    "gruppe": "essen",
    "kategorie": "Salate"
  },
  {
    "id": "item-46",
    "name": "Veganer Salat",
    "preis": 14,
    "gruppe": "essen",
    "kategorie": "Salate"
  },
  {
    "id": "item-47",
    "name": "Ziegenkäse und Walnüsse",
    "preis": 15,
    "gruppe": "essen",
    "kategorie": "Salate"
  },
  {
    "id": "item-48",
    "name": "Hähnchenbrust und Parmesan",
    "preis": 15.5,
    "gruppe": "essen",
    "kategorie": "Salate"
  },
  {
    "id": "item-49",
    "name": "Partyshrimps",
    "preis": 15.5,
    "gruppe": "essen",
    "kategorie": "Salate"
  },
  {
    "id": "item-50",
    "name": "Rinderstreifen",
    "preis": 16.5,
    "gruppe": "essen",
    "kategorie": "Salate"
  },
  {
    "id": "item-51",
    "name": "Bruschetta Classica",
    "preis": 7,
    "gruppe": "essen",
    "kategorie": "Vorspeisen"
  },
  {
    "id": "item-52",
    "name": "Bruschetta Roma",
    "preis": 8,
    "gruppe": "essen",
    "kategorie": "Vorspeisen"
  },
  {
    "id": "item-53",
    "name": "Butter & Brot",
    "preis": 5,
    "gruppe": "essen",
    "kategorie": "Vorspeisen"
  },
  {
    "id": "item-54",
    "name": "Oliven & Brot",
    "preis": 5,
    "gruppe": "essen",
    "kategorie": "Vorspeisen"
  },
  {
    "id": "item-55",
    "name": "Parmesan & Brot",
    "preis": 8.5,
    "gruppe": "essen",
    "kategorie": "Vorspeisen"
  },
  {
    "id": "item-56",
    "name": "Oktopus-Carpaccio",
    "preis": 16.5,
    "gruppe": "essen",
    "kategorie": "Vorspeisen"
  },
  {
    "id": "item-57",
    "name": "Carpaccio vom Rind",
    "preis": 15.5,
    "gruppe": "essen",
    "kategorie": "Vorspeisen"
  },
  {
    "id": "item-58",
    "name": "Spaghetti mit Tomatensoße",
    "preis": 12.5,
    "gruppe": "essen",
    "kategorie": "Pasta"
  },
  {
    "id": "item-59",
    "name": "Spaghetti Aglio Olio mit Peperoncino",
    "preis": 12,
    "gruppe": "essen",
    "kategorie": "Pasta"
  },
  {
    "id": "item-60",
    "name": "Penne all'arrabiata",
    "preis": 12.5,
    "gruppe": "essen",
    "kategorie": "Pasta"
  },
  {
    "id": "item-61",
    "name": "Penne mit Gemüse und Tomatensoße",
    "preis": 13,
    "gruppe": "essen",
    "kategorie": "Pasta"
  },
  {
    "id": "item-62",
    "name": "Penne mit Rinderstreifen und Tomatensoße",
    "preis": 16.5,
    "gruppe": "essen",
    "kategorie": "Pasta"
  },
  {
    "id": "item-63",
    "name": "Orecchiette alla Chef",
    "preis": 16,
    "gruppe": "essen",
    "kategorie": "Pasta"
  },
  {
    "id": "item-64",
    "name": "Tagliatelle mit Lachs in Tomaten-Sahnesoße",
    "preis": 16,
    "gruppe": "essen",
    "kategorie": "Pasta"
  },
  {
    "id": "item-65",
    "name": "Chickenfinger",
    "preis": 13,
    "gruppe": "essen",
    "kategorie": "Fleischgerichte"
  },
  {
    "id": "item-66",
    "name": "Pastrami Sandwich",
    "preis": 12,
    "gruppe": "essen",
    "kategorie": "Fleischgerichte"
  },
  {
    "id": "item-67",
    "name": "Rumpsteak mit Kräuterbutter",
    "preis": 25,
    "gruppe": "essen",
    "kategorie": "Fleischgerichte"
  },
  {
    "id": "item-68",
    "name": "Rumpsteak mit Zwiebeln",
    "preis": 26.5,
    "gruppe": "essen",
    "kategorie": "Fleischgerichte"
  },
  {
    "id": "item-69",
    "name": "Rumpsteak mit Chimichurri",
    "preis": 25,
    "gruppe": "essen",
    "kategorie": "Fleischgerichte"
  },
  {
    "id": "item-70",
    "name": "Frittierte Baby-Calamari",
    "preis": 14,
    "gruppe": "essen",
    "kategorie": "Fischgerichte"
  },
  {
    "id": "item-71",
    "name": "Gegrillte Baby-Calamari",
    "preis": 17,
    "gruppe": "essen",
    "kategorie": "Fischgerichte"
  },
  {
    "id": "item-72",
    "name": "Gegrillte Garnelen",
    "preis": 17.5,
    "gruppe": "essen",
    "kategorie": "Fischgerichte"
  },
  {
    "id": "item-73",
    "name": "Hummusteller",
    "preis": 10,
    "gruppe": "essen",
    "kategorie": "Vegane Gerichte"
  },
  {
    "id": "item-74",
    "name": "Hummusbrot",
    "preis": 12,
    "gruppe": "essen",
    "kategorie": "Vegane Gerichte"
  },
  {
    "id": "item-75",
    "name": "Gegrillter Blumenkohl",
    "preis": 14,
    "gruppe": "essen",
    "kategorie": "Vegane Gerichte"
  },
  {
    "id": "item-76",
    "name": "Pulled Austernpilz-Burger",
    "preis": 16,
    "gruppe": "essen",
    "kategorie": "Vegane Gerichte"
  },
  {
    "id": "item-77",
    "name": "Wasser – Medium / Still (0,2l)",
    "preis": 3,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-78",
    "name": "Wasser – Medium / Still (0,7l)",
    "preis": 7.5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-79",
    "name": "Coca Cola / Coca Cola Zero / Mezzo Mix (0,2l)",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-80",
    "name": "Schweppes (0,2l)",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-81",
    "name": "Frischer O-Saft (0,2l)",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-82",
    "name": "Saft",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-83",
    "name": "Saftschorle",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-84",
    "name": "LIVA Limo",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-85",
    "name": "DOA Limo",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-86",
    "name": "Lemon Soda",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-87",
    "name": "Lila Holunder",
    "preis": 6.5,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-88",
    "name": "Kiwi Limo",
    "preis": 6,
    "gruppe": "trinken",
    "kategorie": "Softdrinks"
  },
  {
    "id": "item-89",
    "name": "Espresso",
    "preis": 2.5,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-90",
    "name": "Americano (klein)",
    "preis": 3,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-91",
    "name": "Americano (groß)",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-92",
    "name": "Cappuccino (klein)",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-93",
    "name": "Cappuccino (groß)",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-94",
    "name": "Latte Macchiato",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-95",
    "name": "Milchkaffee",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-96",
    "name": "Flat White",
    "preis": 4.5,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-97",
    "name": "Iced Latte",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-98",
    "name": "Iced Matcha Latte",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-99",
    "name": "Iced Matcha Latte Mango",
    "preis": 6,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-100",
    "name": "Iced Matcha Latte Strawberry",
    "preis": 6,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-101",
    "name": "Iced Chai Latte",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-102",
    "name": "Iced Mango Latte Coffee",
    "preis": 5.5,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-103",
    "name": "Heisse Schokolade",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-104",
    "name": "Chai Latte",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-105",
    "name": "Golden Milk",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-106",
    "name": "Matcha Latte",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Coffee, Iced & Milk"
  },
  {
    "id": "item-107",
    "name": "Schwarz / Grün / Kräuter / Früchte",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-108",
    "name": "Frischer Ingwer",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-109",
    "name": "Frische Minze",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-110",
    "name": "Frische Minze-Ingwer",
    "preis": 4.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-111",
    "name": "San Miguel (0,33l)",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-112",
    "name": "Licher Natur Radler (0,33l)",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-113",
    "name": "Licher Natur Radler Alkoholfrei (0,33l)",
    "preis": 3.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-114",
    "name": "Corona (0,33l)",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-115",
    "name": "Corona Zero (0,33l)",
    "preis": 4,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-116",
    "name": "Franziskaner Weissbier (0,5l)",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-117",
    "name": "Franziskaner Weissbier Alkoholfrei (0,5l)",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-118",
    "name": "Prosecco",
    "preis": 5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-119",
    "name": "Mimosa",
    "preis": 6.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-120",
    "name": "Aperol Spritz",
    "preis": 8.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-121",
    "name": "Aperol Spritz Alkoholfrei",
    "preis": 8,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-122",
    "name": "Sarti Spritz",
    "preis": 8.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-123",
    "name": "Limoncello Spritz",
    "preis": 8.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-124",
    "name": "Lillet Blueberry",
    "preis": 8.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-125",
    "name": "Lillet Wild Berry",
    "preis": 8.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-126",
    "name": "Hugo",
    "preis": 8.5,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-127",
    "name": "Hugo Alkoholfrei",
    "preis": 8,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-128",
    "name": "Martini Pomegranate Alkoholfrei",
    "preis": 8,
    "gruppe": "trinken",
    "kategorie": "Tee, Bier & Prosecco"
  },
  {
    "id": "item-129",
    "name": "Cuvée Chardonnay, Sauvignon Blanc (Glas (0,2l))",
    "preis": 7,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-130",
    "name": "Cuvée Chardonnay, Sauvignon Blanc (Flasche)",
    "preis": 22,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-131",
    "name": "Chardonnay (Glas (0,2l))",
    "preis": 7,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-132",
    "name": "Chardonnay (Flasche)",
    "preis": 22,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-133",
    "name": "Sauvignon Blanc (Glas (0,2l))",
    "preis": 7,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-134",
    "name": "Sauvignon Blanc (Flasche)",
    "preis": 22,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-135",
    "name": "Pinot Blanc Réserve (Glas (0,2l))",
    "preis": 8,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-136",
    "name": "Pinot Blanc Réserve (Flasche)",
    "preis": 25,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-137",
    "name": "Weißwein Cuvée (Glas (0,2l))",
    "preis": 7.5,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-138",
    "name": "Weißwein Cuvée (Flasche)",
    "preis": 23.5,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-139",
    "name": "Riesling (Glas (0,2l))",
    "preis": 7.5,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-140",
    "name": "Riesling (Flasche)",
    "preis": 23.5,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-141",
    "name": "Grauburgunder (Glas (0,2l))",
    "preis": 7.5,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-142",
    "name": "Grauburgunder (Flasche)",
    "preis": 23.5,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-143",
    "name": "Trebbiano di Lugana (Glas (0,2l))",
    "preis": 9.5,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-144",
    "name": "Trebbiano di Lugana (Flasche)",
    "preis": 29.5,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-145",
    "name": "Pinot Grigio (Glas (0,2l))",
    "preis": 9,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-146",
    "name": "Pinot Grigio (Flasche)",
    "preis": 28,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-147",
    "name": "Cuvée Chardonnay, Trebbiano (Glas (0,2l))",
    "preis": 7,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-148",
    "name": "Cuvée Chardonnay, Trebbiano (Flasche)",
    "preis": 22,
    "gruppe": "trinken",
    "kategorie": "Weissweine"
  },
  {
    "id": "item-149",
    "name": "Cabernet Sauvignon (Glas (0,2l))",
    "preis": 7,
    "gruppe": "trinken",
    "kategorie": "Rotweine"
  },
  {
    "id": "item-150",
    "name": "Cabernet Sauvignon (Flasche)",
    "preis": 22,
    "gruppe": "trinken",
    "kategorie": "Rotweine"
  },
  {
    "id": "item-151",
    "name": "Gamay (Glas (0,2l))",
    "preis": 9,
    "gruppe": "trinken",
    "kategorie": "Rotweine"
  },
  {
    "id": "item-152",
    "name": "Gamay (Flasche)",
    "preis": 28,
    "gruppe": "trinken",
    "kategorie": "Rotweine"
  },
  {
    "id": "item-153",
    "name": "Primitivo (Glas (0,2l))",
    "preis": 8.5,
    "gruppe": "trinken",
    "kategorie": "Rotweine"
  },
  {
    "id": "item-154",
    "name": "Primitivo (Flasche)",
    "preis": 26.5,
    "gruppe": "trinken",
    "kategorie": "Rotweine"
  },
  {
    "id": "item-155",
    "name": "Syrah (Glas (0,2l))",
    "preis": 8,
    "gruppe": "trinken",
    "kategorie": "Rotweine"
  },
  {
    "id": "item-156",
    "name": "Syrah (Flasche)",
    "preis": 25,
    "gruppe": "trinken",
    "kategorie": "Rotweine"
  },
  {
    "id": "item-157",
    "name": "Cuvée Syrah, Grenache (Glas (0,2l))",
    "preis": 7.5,
    "gruppe": "trinken",
    "kategorie": "Roséweine"
  },
  {
    "id": "item-158",
    "name": "Cuvée Syrah, Grenache (Flasche)",
    "preis": 23.5,
    "gruppe": "trinken",
    "kategorie": "Roséweine"
  },
  {
    "id": "item-159",
    "name": "Spätburgunder (Glas (0,2l))",
    "preis": 7.5,
    "gruppe": "trinken",
    "kategorie": "Roséweine"
  },
  {
    "id": "item-160",
    "name": "Spätburgunder (Flasche)",
    "preis": 23.5,
    "gruppe": "trinken",
    "kategorie": "Roséweine"
  },
  {
    "id": "item-161",
    "name": "Cuvée (Glas (0,2l))",
    "preis": 7.5,
    "gruppe": "trinken",
    "kategorie": "Alkoholfreie Weine"
  },
  {
    "id": "item-162",
    "name": "Cuvée (Flasche)",
    "preis": 23.5,
    "gruppe": "trinken",
    "kategorie": "Alkoholfreie Weine"
  }
]
