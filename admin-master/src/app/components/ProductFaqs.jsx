"use client";
import { Autocomplete, TextField, Button, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getProducts, fetchData } from "../api";
import { useSnackbar } from "../SnackbarProvider";
import axios from "../../../axios";
import { MdExpandMore } from "react-icons/md";
import Swal from "sweetalert2";

const ProductFaqs = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState({ question: false, answer: false });
  const [productList, setProductList] = useState([]);
  const [faqsSet, setFaqsSet] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // New state for edit index
  const [loading, setLoading] = useState(false);
  const { openSnackbar } = useSnackbar();
  const [faqQuestionlist, setFaqQuestionList] = useState([]);
  const [answersQues, setAnswersQues] = useState({}); // Track answers for each question

  useEffect(() => {
    const fetchIntilaData = async () => {
      const data = await getProducts();
      setProductList(data.products);
      const faqData = await fetchData("/api/get-product-faq-admin?type=question");
      setFaqQuestionList(faqData.faq);
    };
    fetchIntilaData();
  }, []);

  // Function to handle adding or editing FAQs
  const handleNexFaqs = () => {
    if (!question || !answer || !selectedProduct) {
      setError({ question: !question, answer: !answer });
      return;
    }

    const newFaq = {
      product_id: selectedProduct.id,
      faq_heading: question,
      faq_content: answer,
    };

    if (editIndex !== null) {
      // Update the existing FAQ
      const updatedFaqsSet = [...faqsSet];
      updatedFaqsSet[editIndex] = newFaq;
      setFaqsSet(updatedFaqsSet);
      setEditIndex(null); // Reset edit mode
    } else {
      // Add new FAQ
      setFaqsSet((prev) => [...prev, newFaq]);
    }

    // Clear form fields after adding/editing
    setQuestion("");
    setAnswer("");
    setSelectedProduct(null);
    setError({ question: false, answer: false });
  };

  const handleEditFaq = (index) => {
    const faq = faqsSet[index];
    setSelectedProduct(productList.find((p) => p.id === faq.product_id));
    setQuestion(faq.faq_heading);
    setAnswer(faq.faq_content);
    setEditIndex(index); // Set the index of the FAQ being edited
  };

  const handleSubmitFaqs = async () => {
    if (faqsSet.length === 0) {
      alert("Please add FAQs before submitting");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        faqs: JSON.stringify(faqsSet),
      };

      const res = await axios.post("/api/create-product-faq-admin", payload, {
        headers: {
          Authorization: localStorage.getItem("onlineKingToken"),
        },
      });

      if (res.data.status === "success") {
        openSnackbar(res.data.message, "success");
        setFaqsSet([]);
        setLoading(false);
      } else {
        openSnackbar(res.data.message, "error");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      openSnackbar("Failed to submit FAQs. Please try again.", "error");
    }
  };

  // Handle submitting answers for existing FAQs
  const handleSubmitFaqsAns = async (index) => {
    Swal.fire({
      title: "Submit",
      text: "Do you want to submit this answer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CFAA4C",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
      confirmButtonText: "Yes! Submit it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);

          const data = faqQuestionlist[index];
          const payload = {
            product_id: data.product_id,
            faq_heading: data.faq_heading,
            faq_content: answersQues[index],
          };

          const res = await axios.post("/api/create-product-faq", payload, {
            headers: {
              Authorization: localStorage.getItem("onlineKingToken"),
            },
          });

          if (res.data.status === "success") {
            openSnackbar(res.data.message, "success");

            // Clear form fields after submission
            const faqData = await fetchData("/api/get-product-faq-admin?type=question");
            setFaqQuestionList(faqData.faq);
            setAnswersQues({});
            setLoading(false);
          } else {
            openSnackbar(res.data.message, "error");
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          openSnackbar("Failed to submit FAQs. Please try again.", "error");
        }
      }
    });
  };

  // Handle change in input for each answer
  const handleAnswerChange = (index, value) => {
    setAnswersQues((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <div className="px-[20px] container mx-auto">
      <div className="py-[10px] flex flex-col space-y-5">
        <div className="flex flex-col space-y-1">
          <span className="text-[30px] text-[#101828] font-[500]">Product FAQs Setup</span>
          <span className="text-[#667085] font-[400] text-[16px]">
            Effortlessly organize your product offerings with intuitive Product FAQs Setup for a seamless and structured e-commerce experience.
          </span>
        </div>

        <div className="bg-white flex justify-between gap-4 shadow-lg rounded-lg p-6 mt-8">
          <div className="w-1/2">
            <div className="px-4">
              <Typography variant="h5" className="font-bold mb-4">FAQs Set for Product</Typography>

              <ul className="shadow-lg px-2 overflow-y-auto">
                {faqsSet.length > 0 && faqsSet.map((item, index) => (
                  <li key={`${index}`} className="mb-4">
                    <Typography variant="subtitle1" className="font-bold">
                      Question: {item.faq_heading}
                    </Typography>
                    <Typography variant="body1">Answer: {item.faq_content}</Typography>
                    <Button
                      variant="outlined"
                      onClick={() => handleEditFaq(index)}
                      className="mt-2"
                    >
                      Edit
                    </Button>
                  </li>
                ))}
              </ul>

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  onClick={handleSubmitFaqs}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full mt-4"
                >
                  Submit FAQs
                </Button>
              </div>
            </div>

            <div className="px-4">
              <Typography variant="h5" className="font-bold mb-4">Add FAQ for Product</Typography>
              <div className="mb-4">
                <Autocomplete
                  options={productList}
                  getOptionLabel={(option) => option.product_name}
                  value={selectedProduct}
                  onChange={(event, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => <TextField {...params} label="Search Product..." variant="outlined" />}
                  fullWidth
                />
              </div>

              <div className="mb-4">
                <TextField
                  label="Enter Question"
                  variant="outlined"
                  fullWidth
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  error={error.question}
                  helperText={error.question ? "Question is required" : ""}
                />
              </div>

              <div className="mb-4">
                <TextField
                  label="Enter Answer"
                  variant="outlined"
                  fullWidth
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  multiline
                  rows={4}
                  error={error.answer}
                  helperText={error.answer ? "Answer is required" : ""}
                />
              </div>

              <div className="text-center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNexFaqs}
                  disabled={!selectedProduct}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full"
                >
                  {editIndex !== null ? "Update FAQ" : "Next FAQs"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-grow h-[600px] shadow-lg rounded overflow-y-scroll p-6 bg-white">
            <Typography variant="h5" className="text-center font-bold mb-4">Answer FAQs of Product</Typography>

            <div>
              {faqQuestionlist.length > 0 ? (
                faqQuestionlist.map((faq, index) => (
                  <div key={index} className="transition-transform transform duration-300 ease-out space-y-2">
                    <Accordion className="bg-white rounded-lg border border-gray-200" TransitionProps={{ unmountOnExit: true }}>
                      <AccordionSummary expandIcon={<MdExpandMore />} className="bg-green-500 text-black font-bold rounded-t-lg">
                        <Typography>{faq.faq_heading}</Typography>
                      </AccordionSummary>
                      <AccordionDetails className="p-4">
                        <div className="flex justify-between py-2 items-center">
                          <Typography className="mb-4">{faq.faq_heading}</Typography>
                          <div>
                            <img
                              src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}${faq.product.images[0].image_url}`}
                              className="w-[50px]"
                            />
                            <Typography className="mb-4">{faq.product.product_name}</Typography>
                          </div>
                        </div>

                        <TextField
                          label="Enter Answer"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={3}
                          value={answersQues[index] || ""}
                          onChange={(event) => handleAnswerChange(index, event.target.value)}
                        />

                        <div className="text-right mt-4">
                          <Button
                            variant="contained"
                            disabled={loading}
                            color="primary"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={async () => await handleSubmitFaqsAns(index)}
                          >
                            Submit Answer
                          </Button>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))
              ) : (
                <Typography className="text-center mt-10">All FAQs have been answered!</Typography>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFaqs;
