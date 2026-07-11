import React from "react";
import AdminCrudList from "./AdminCrudList";

export function AdminCategories() {
  return <AdminCrudList
    endpoint="categories" title="Categories" eyebrow="Taxonomy"
    testIdPrefix="cat"
    fields={[
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug", editable: false },
      { key: "description", label: "Description", type: "textarea" },
    ]}/>;
}

export function AdminCollections() {
  return <AdminCrudList
    endpoint="collections" title="Collections" eyebrow="Curation"
    testIdPrefix="col"
    fields={[
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug", editable: false },
      { key: "description", label: "Description", type: "textarea" },
      { key: "cover_image", label: "Cover image URL" },
    ]}/>;
}

export function AdminOffers() {
  return <AdminCrudList
    endpoint="offers" title="Offers" eyebrow="Promotions"
    testIdPrefix="offer"
    fields={[
      { key: "title", label: "Title" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "banner", label: "Banner image URL" },
      { key: "start_date", label: "Start date" },
      { key: "end_date", label: "End date" },
      { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
    ]}/>;
}

export function AdminBanners() {
  return <AdminCrudList
    endpoint="banners" title="Banners" eyebrow="Homepage"
    testIdPrefix="banner"
    fields={[
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle" },
      { key: "image", label: "Image URL" },
      { key: "link", label: "Link URL" },
      { key: "kind", label: "Kind", type: "select", options: ["hero","sale","festival","new_arrival","offer"] },
      { key: "order", label: "Order", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["active", "inactive"] },
    ]}/>;
}
