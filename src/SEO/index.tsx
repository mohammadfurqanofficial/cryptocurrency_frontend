import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
}

export function SEO({ title = "Criptolab", description }: SEOProps) {
  return (
    <>
      <Head>
        <title>{`${title}${description ? `| ${description}` : ""}`}</title>

        <meta name="author" content="Higor Allan" />
        <meta
          name="keywords"
          content="Criptomoeda, Criptolab, criptolab, coins, moeda digital"
        />
        <meta name="google" content="translate" />
        <meta name="theme-color" content="#121214" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
