<div>
  <h1>zeroday.pw</h1>
  <p>
    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex
    sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis
    convallis. Tempus leo eu aenean sed diam urna tempor.
  </p>
</div>

<div>
  <h2>Rules</h2>
  <p>
    Ut hendrerit semper vel class aptent taciti sociosqu. <a href="#"
      >Quisque faucibus</a
    > ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis
    convallis. Tempus leo eu aenean sed diam urna tempor.
  </p>

  <ul>
    <li>
      Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum
      dolor sit amet consectetur adipiscing elit.
    </li>
    <li>
      Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus
      ex sapien vitae pellentesque sem placerat.
    </li>
    <li>
      In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed
      diam urna tempor.
    </li>
    <li>
      Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa
      nisl malesuada lacinia integer nunc posuere.
    </li>
  </ul>
</div>

<style>
  @import "$lib/tailwind.css";

  h1 {
    @apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
  }

  h2 {
    @apply scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0;
  }

  h3 {
    @apply scroll-m-20 text-2xl font-semibold tracking-tight;
  }

  h4 {
    @apply scroll-m-20 text-2xl font-semibold tracking-tight;
  }

  p {
    @apply leading-7 [&:not(:first-child)]:mt-6;
  }

  a {
    @apply text-primary font-medium underline underline-offset-4;
  }

  blockquote {
    @apply mt-6 border-l-2 pl-6 italic;
  }

  ul {
    @apply my-6 ml-6 list-disc [&>li]:mt-2;
  }
</style>
