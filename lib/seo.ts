export const updatePageMetadata = (title: string, description: string) => {
  document.title = title;
  
  let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (metaDescription) {
    metaDescription.content = description;
  } else {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = description;
    document.head.appendChild(metaDescription);
  }
};