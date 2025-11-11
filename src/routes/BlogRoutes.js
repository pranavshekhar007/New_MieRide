import React from "react";
import { Routes, Route } from "react-router-dom";
import BlogList from "../pages/Blog/BlogList";
import BlogCategoryList from "../pages/Blog/BlogCategoryList";
import CreateBlog from "../pages/Blog/CreateBlog";
import UpdateBlog from "../pages/Blog/UpdateBlog";

function BlogRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/blog-list" element={<BlogList />} />
      <Route path="/blog-categories" element={<BlogCategoryList />} />
      <Route path="/create-blog" element={<CreateBlog/>} />
      <Route path="/update-blog/:id" element={<UpdateBlog/>} />
    </Routes>
  );
}

export default BlogRoutes;
