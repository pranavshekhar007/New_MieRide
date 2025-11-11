import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  createBlogServ,
  getBlogCategoryListServ,
  getBlogDetailsServ,
  updateBlogServ,
} from "../../services/blog.services";
import { Image_Base_Url } from "../../utils/api_base_url_configration";
function UpdateBlog() {
  const params = useParams();
  const editor = useRef(null);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const config = {
    placeholder: "Start typing...", // Placeholder text
    height: "400px",
  };
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
  const handleUpdateBlog = async () => {
    setIsLoading(true);
    try {
      const finalFormData = new FormData();
      finalFormData.append("title", formData?.title);
      finalFormData.append("another_title", formData?.another_title);
      finalFormData.append("app_title", formData?.app_title);
      finalFormData.append("seo_title", formData?.seo_title);
      finalFormData.append("meta_description", formData?.meta_description);
      finalFormData.append("description", formData?.description);
      finalFormData.append("short_description", formData?.short_description);
      finalFormData.append("category_id", formData?.category_id);
      finalFormData.append("tags", formData?.tags);
      finalFormData.append("meta_keywords", formData?.meta_keywords);
      finalFormData.append("blog_id", params?.id);
      finalFormData.append("status", formData?.status);
      if (formData?.image) {
        finalFormData.append("image", formData?.image);
      }
      const response = await updateBlogServ(finalFormData);
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
  const [list, setList] = useState([]);
  const getListItemsFunction = async () => {
    try {
      let response = await getBlogCategoryListServ({});
      setList(response?.data?.data);
    } catch (error) {}
  };

  const getBlogDetailsFunc = async () => {
    try {
      let response = await getBlogDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setFormData({
          title: response?.data?.data?.title,
          another_title: response?.data?.data?.another_title,
          app_title: response?.data?.data?.app_title,
          seo_title: response?.data?.data?.seo_title,
          meta_keywords: response?.data?.data?.meta_keywords,
          meta_description: response?.data?.data?.meta_description,
          tags: response?.data?.data?.tags,
          image: "",
          short_description: response?.data?.data?.short_description,
          description: response?.data?.data?.description,
          category_id: response?.data?.data?.category_id,
          imgPrev: Image_Base_Url + response?.data?.data?.image,
          staus: response?.data?.data?.status,
        });
      }
    } catch (error) {}
  };
  useEffect(() => {
    getBlogDetailsFunc();
    getListItemsFunction();
  }, [params?.id]);
  return (
    <div className="main_layout  bgBlack d-flex ">
      {/* sidebar started */}
      <Sidebar selectedItem="Blogs" />
      {/* sidebar ended */}

      {/* sectionLayout started */}
      <section
        className="section_layout"
        style={{
          marginLeft: globalState?.isFillSidebarWidth100 ? "260px" : "80px",
        }}
      >
        {/* table List started */}
        <div className="tableMain createBlogMain">
          <div
            className="tableBody py-2 px-4 borderRadius50All"
            style={{ background: "whitesmoke" }}
          >
            <div style={{ margin: "20px 10px" }}>
              <div className="d-flex justify-content-between align-items-center my-4">
                <h3 className="text-secondary">
                  <u>Update Blog</u>
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
                    <div className="d-flex justify-content-center ">
                      <img
                        className="img-fluid"
                        src={
                          formData?.imgPrev
                            ? formData?.imgPrev
                            : "https://cdn-icons-png.flaticon.com/128/159/159626.png"
                        }
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
                {/* <div className="col-4 mb-2">
                  <label>Another Title</label>
                  <input
                    className="form-control"
                    value={formData?.another_title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        another_title: e?.target?.value,
                      })
                    }
                  />
                </div>
                <div className="col-4 mb-2">
                  <label>App Title</label>
                  <input
                    className="form-control"
                    value={formData?.app_title}
                    onChange={(e) =>
                      setFormData({ ...formData, app_title: e?.target?.value })
                    }
                  />
                </div> */}
                <div className="col-4 mb-2">
                  <label>Seo Title</label>
                  <input
                    className="form-control"
                    value={formData?.seo_title}
                    onChange={(e) =>
                      setFormData({ ...formData, seo_title: e?.target?.value })
                    }
                  />
                </div>
                <div className="col-4 mb-2">
                  <label>Meta Keywords (Seperate with coma)</label>
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
                  <label>Meta Description</label>
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
                <div className="col-4 mb-2">
                  <label>Tags* (Seperate with coma)</label>
                  <input
                    className="form-control"
                    value={formData?.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e?.target?.value })
                    }
                  />
                </div>
                <div className="col-4 mb-2">
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
                    <option>Select</option>
                    {list?.map((v, i) => {
                      return <option value={v?.id}>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-4 mb-2">
                  <label>Status*</label>
                  <select
                    className="form-control"
                    value={formData?.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e?.target?.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
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
                          "undo",
                          "redo",
                          "font",
                          "fontSize",
                          "formatBlock",
                          "paragraphStyle",
                          "blockquote",
                          "bold",
                          "underline",
                          "italic",
                          "strike",
                          "subscript",
                          "superscript",
                          "fontColor",
                          "hiliteColor",
                          "textStyle",
                          "removeFormat",
                          "outdent",
                          "indent",
                          "align",
                          "horizontalRule",
                          "list",
                          "lineHeight",
                          "table",
                          "link",
                          "image",
                          "video",
                          "audio",
                          "imageGallery",
                          "fullScreen",
                          "showBlocks",
                          "codeView",
                          "preview",
                          "print",
                        ],
                      ],
                    }}
                  />
                </div>

                {/* <div className="col-12 mb-2">
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
                      placeholder: "Short description...",
                      buttonList: [
                        [
                          "undo",
                          "redo",
                          "font",
                          "fontSize",
                          "formatBlock",
                          "paragraphStyle",
                          "blockquote",
                          "bold",
                          "underline",
                          "italic",
                          "strike",
                          "subscript",
                          "superscript",
                          "fontColor",
                          "hiliteColor",
                          "textStyle",
                          "removeFormat",
                          "outdent",
                          "indent",
                          "align",
                          "horizontalRule",
                          "list",
                          "lineHeight",
                          "table",
                          "link",
                          "image",
                          "video",
                          "audio",
                          "imageGallery",
                          "fullScreen",
                          "showBlocks",
                          "codeView",
                          "preview",
                          "print",
                        ],
                      ],
                    }}
                  />
                </div> */}
                <div className="col-12 mb-2">
                  {formData?.imgPrev &&
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
                        Publiching ...
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleUpdateBlog}
                      >
                        Publich
                      </button>
                    )
                  ) : (
                    <button
                      className="btn btn-primary w-100"
                      style={{ opacity: "0.4" }}
                    >
                      Publich
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* table List ended */}
      </section>
      {/* sectionLayout ended */}
    </div>
  );
}
export default UpdateBlog;
