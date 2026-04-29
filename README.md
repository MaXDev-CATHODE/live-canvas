# Live Canvas 🎨

Profesjonalne narzędzie do kolaboracji wizualnej w czasie rzeczywistym. Twórz, rysuj i planuj wspólnie z innymi na interaktywnej tablicy o nieskończonym potencjale.

![Demo Placeholder](https://img.shields.io/badge/Live-Demo-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React_19_%7C_TypeScript_%7C_Liveblocks-blue)

## 🚀 O Projekcie

Live Canvas to zaawansowana aplikacja typu "multiplayer whiteboard", zbudowana z myślą o płynnej współpracy zespołów zdalnych. Projekt łączy w sobie precyzję rysowania odręcznego z elastycznością cyfrowych notatek, a wszystko to synchronizowane w milisekundach pomiędzy wszystkimi uczestnikami sesji.

### Kluczowe Funkcjonalności:

*   **Tryb Multiplayer (Liveblocks)** – Widoczność kursorów innych użytkowników w czasie rzeczywistym oraz błyskawiczna synchronizacja zmian.
*   **Odręczne Rysowanie (Perfect Freehand)** – Zaawansowane algorytmy wygładzania ścieżek, które sprawiają, że rysowanie myszką lub rysikiem przypomina fizyczny długopis.
*   **Inteligentne Notatki (Sticky Notes)** – Możliwość tworzenia, edytowania i dowolnego rozmieszczania karteczek z funkcją inteligentnego ignorowania zdarzeń w trybie rysowania (możesz pisać "po nich" bez przerywania linii).
*   **Globalne Undo (CRDT)** – Innowacyjny system Cofnij (Ctrl+Z), który działa na poziomie bazy danych. Twoja historia zmian nie znika po odświeżeniu strony i jest spójna dla wszystkich uczestników.
*   **Zero-Branding Experience** – Interfejs w pełni oczyszczony z logotypów zewnętrznych dostawców, oferujący czyste i profesjonalne wrażenia wizualne (White-label).

## 🛠️ Stos Technologiczny

Projekt został zbudowany przy użyciu najnowocześniejszych bibliotek ekosystemu React:

*   **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Język:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
*   **Kolaboracja:** [Liveblocks](https://liveblocks.io/) (Presence & Storage CRDT)
*   **Stylizacja:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animacje:** [Motion](https://motion.dev/) (wcześniej Framer Motion)
*   **Rysowanie:** [Perfect Freehand](https://github.com/steveruizok/perfect-freehand)
*   **Ikony:** [Lucide React](https://lucide.dev/)

## 🧠 Rozwiązania Techniczne (Z perspektywy dewelopera)

Podczas prac nad projektem skupiłem się na rozwiązaniu kilku nietrywialnych problemów:

1.  **Gładkość vs Synchronizacja:** Aby uniknąć lagów przy rysowaniu, zastosowałem system efemerycznych "Draftów" w Presence użytkownika. Pełna ścieżka SVG jest budowana lokalnie i przesyłana jako gotowy obiekt do Storage dopiero po puszczeniu przycisku myszy, co optymalizuje transfer danych.
2.  **Shadow DOM & UI Polishing:** Liveblocks wstrzykuje swój badge brandingowy w Shadow DOM, co uniemożliwia jego ukrycie przez standardowy CSS. Rozwiązałem to za pomocą dedykowanego "Shadow Crawler", który monitoruje dokument i siłowo usuwa niechciane elementy bezpośrednio z izolowanych Shadow Roots.
3.  **Persystencja Historii:** Standardowe `useHistory` w React gubi dane po odświeżeniu. Moje autorskie rozwiązanie Undo iteruje wstecz po globalnej liście obiektów CRDT w chmurze, dzięki czemu użytkownik może wrócić do projektu po tygodniu i nadal cofnąć swoje ostatnie pociągnięcia pędzlem.

## 🏁 Jak zacząć?

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/twoj-user/live-canvas.git
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Skonfiguruj klucze (jeśli wymagane) w `.env` i uruchom:
   ```bash
   npm run dev
   ```

---
*Projekt stworzony z dbałością o UX i jakość kodu jako część profesjonalnego portfolio.*
