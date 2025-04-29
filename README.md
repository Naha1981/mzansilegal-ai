# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Troubleshooting

### Failed to load chunk /_next/static/chunks/...

If you encounter runtime errors like "Failed to load chunk", it often indicates an issue with the build cache or dependencies. Try the following steps in your terminal:

1.  **Stop the development server.**
2.  **Delete the `.next` folder:**
    ```bash
    rm -rf .next
    ```
3.  **Delete the `node_modules` folder:**
    ```bash
    rm -rf node_modules
    ```
4.  **Reinstall dependencies:**
    ```bash
    # If using npm
    npm install

    # If using yarn
    # yarn install

    # If using pnpm
    # pnpm install
    ```
5.  **Restart the development server:**
    ```bash
    npm run dev
    # or yarn dev / pnpm dev
    ```

This process cleans out potentially corrupted build artifacts and ensures you have fresh dependencies.
