import PageHead from "../src/components/Helpers/PageHead";
import Home from "./../src/components/Home/index";
export default function HomePage({ data }) {
  const { seoSetting } = data;
  return (
    <>
      <PageHead
        title={`${seoSetting.seo_title}`}
        metaDes={seoSetting.seo_description}
      />
      <Home homepageData={data} />
    </>
  );
}
export async function getServerSideProps() {
  // Fetch data from external API
  const fallbackData = {
    seoSetting: {
      seo_title: "OUI",
      seo_description: "",
    },
  };

  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}api/`;
    const res = await fetch(url);
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(
        "[getServerSideProps] API request failed",
        JSON.stringify({ url, status: res.status, contentType, bodySnippet: body.slice(0, 200) })
      );
      return { props: { data: fallbackData } };
    }

    if (!contentType.toLowerCase().includes("application/json")) {
      const body = await res.text().catch(() => "");
      console.error(
        "[getServerSideProps] API returned non-JSON response",
        JSON.stringify({ url, status: res.status, contentType, bodySnippet: body.slice(0, 200) })
      );
      return { props: { data: fallbackData } };
    }

    const data = await res.json();
    return { props: { data } };
  } catch (err) {
    console.error("[getServerSideProps] API request error", err);
    return { props: { data: fallbackData } };
  }
}
