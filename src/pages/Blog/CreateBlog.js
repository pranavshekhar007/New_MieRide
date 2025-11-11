import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  createBlogServ,
  getBlogCategoryListServ,
} from "../../services/blog.services";

function CreateBlog() {
  const navigate = useNavigate();
  const { setGlobalState, globalState } = useGlobalState();

  const [formData, setFormData] = useState({
    title: "",
    another_title: "",
    app_title: "",
    seo_title: "",
    meta_keywords: "",
    meta_description: "",
    tags: "",
    image: "",
    short_description: "",
    description: "",
    category_id: "",
    imgPrev: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);

  const handleSubmitBlog = async () => {
    setIsLoading(true);
    try {
      const finalFormData = new FormData();
      finalFormData.append("title", formData?.title);
      finalFormData.append("another_title", formData?.another_title);
      finalFormData.append("app_title", formData?.app_title);
      finalFormData.append("seo_title", formData?.seo_title);
      finalFormData.append("meta_description", formData?.meta_description);
      finalFormData.append("image", formData?.image);
      finalFormData.append("description", formData?.description);
      finalFormData.append("short_description", formData?.short_description);
      finalFormData.append("category_id", formData?.category_id);
      finalFormData.append("tags", formData?.tags);
      finalFormData.append("meta_keywords", formData?.meta_keywords);

      const response = await createBlogServ(finalFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setFormData({
          title: "",
          another_title: "",
          app_title: "",
          seo_title: "",
          meta_keywords: "",
          meta_description: "",
          tags: "",
          image: "",
          short_description: "",
          description: "",
          category_id: "",
          imgPrev: "",
        });
        navigate("/blog-list");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  const getListItemsFunction = async () => {
    try {
      let response = await getBlogCategoryListServ({});
      setList(response?.data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getListItemsFunction();
  }, []);

  return (
    <div className="main_layout bgBlack d-flex">
      <Sidebar selectedItem="Blogs" />

      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        <div className="tableMain createBlogMain">
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "whitesmoke" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <div className="d-flex justify-content-between align-items-center my-4">
                <h3 className="text-secondary">
                  <u>Create Blog</u>
                </h3>
                <button
                  className="btn btn-success"
                  style={{
                    width: "200px",
                    background: "#139F01",
                    borderRadius: "20px",
                  }}
                  onClick={() => navigate("/blog-list")}
                >
                  Blogs
                </button>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="col-4 border shadow-sm rounded p-2 bg-light mb-2">
                    <div className="d-flex justify-content-center">
                      <img
                        className="img-fluid"
                        src={
                          formData?.imgPrev
                            ? formData?.imgPrev
                            : "https://cdn-icons-png.flaticon.com/128/159/159626.png"
                        }
                        alt="Preview"
                      />
                    </div>
                    <label>Upload Banner*</label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e?.target?.files[0],
                          imgPrev: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="col-4 mb-2">
                  <label>Title*</label>
                  <input
                    className="form-control"
                    value={formData?.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e?.target?.value })
                    }
                  />
                </div>

                <div className="col-4 mb-2">
                  <label>Seo Title (Optional)</label>
                  <input
                    className="form-control"
                    value={formData?.seo_title}
                    onChange={(e) =>
                      setFormData({ ...formData, seo_title: e?.target?.value })
                    }
                  />
                </div>

                <div className="col-4 mb-2">
                  <label>Meta Keywords (Separate with comma)</label>
                  <input
                    className="form-control"
                    value={formData?.meta_keywords}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_keywords: e?.target?.value,
                      })
                    }
                  />
                </div>

                <div className="col-12 mb-2">
                  <label>Meta Description (Optional)</label>
                  <textarea
                    className="form-control"
                    value={formData?.meta_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meta_description: e?.target?.value,
                      })
                    }
                  />
                </div>

                <div className="col-6 mb-2">
                  <label>Tags* (Separate with comma)</label>
                  <input
                    className="form-control"
                    value={formData?.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e?.target?.value })
                    }
                  />
                </div>

                <div className="col-6 mb-2">
                  <label>Category*</label>
                  <select
                    className="form-control"
                    value={formData?.category_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: e?.target?.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    {list?.map((v) => (
                      <option key={v?.id} value={v?.id}>
                        {v?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 mb-2">
                  <label>Description*</label>
                  <SunEditor
                    setContents={formData?.description}
                    onChange={(content) =>
                      setFormData({ ...formData, description: content })
                    }
                     height="350px"
                    setOptions={{
                     
                      placeholder: "Start typing...",
                      buttonList: [
      [
            'undo', 'redo',
            'font', 'fontSize', 'formatBlock',
            'paragraphStyle', 'blockquote',
            'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
            'fontColor', 'hiliteColor', 'textStyle',
            'removeFormat',
            'outdent', 'indent',
            'align', 'horizontalRule', 'list', 'lineHeight',
            'table', 'link', 'image', 'video', 'audio',
             'imageGallery',
            'fullScreen', 'showBlocks', 'codeView',
            'preview', 'print'
          ]
    ]
                    }}
                  />
                </div>

                <div className="col-12 mb-2">
                  <label>Short Description*</label>
                  <SunEditor
                    setContents={formData?.short_description}
                    onChange={(content) =>
                      setFormData({
                        ...formData,
                        short_description: content,
                      })
                    }
                     height="200px"
                    setOptions={{
                      height: 500,
                      placeholder: "Short description...",
                      buttonList: [
      [
            'undo', 'redo',
            'font', 'fontSize', 'formatBlock',
            'paragraphStyle', 'blockquote',
            'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
            'fontColor', 'hiliteColor', 'textStyle',
            'removeFormat',
            'outdent', 'indent',
            'align', 'horizontalRule', 'list', 'lineHeight',
            'table', 'link', 'image', 'video', 'audio',
             'imageGallery',
            'fullScreen', 'showBlocks', 'codeView',
            'preview', 'print'
          ]
    ]
                    }}
                  />
                </div>

                <div className="col-12 mb-2">
                  {formData?.image &&
                  formData?.title &&
                  formData?.category_id &&
                  formData?.description &&
                  formData?.short_description &&
                  formData?.tags?.length > 0 ? (
                    isLoading ? (
                      <button
                        className="btn btn-primary w-100"
                        style={{ opacity: "0.5" }}
                      >
                        Publishing...
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleSubmitBlog}
                      >
                        Publish
                      </button>
                    )
                  ) : (
                    <button
                      className="btn btn-primary w-100"
                      style={{ opacity: "0.4" }}
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreateBlog;
