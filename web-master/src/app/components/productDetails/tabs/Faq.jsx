"use client";
import useProductStore from '@/app/storeContext/store';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MdExpandMore } from "react-icons/md";
import { useSnackbar } from '@/app/SnackBarProvider';

const Faq = ({ params, data }) => {
  const { openSnackbar } = useSnackbar();
  const { fetchFaqData, faqData, createproductFaq } = useProductStore();
  const [expanded, setExpanded] = useState("panel0");
  const [question, setQuestion] = useState({
    faq_heading: "",
    product_id: data.id,
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchFaqData(data.id);
  }, [fetchFaqData]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : "");
  };

  const handleSubmit = () => {
    if (!question.faq_heading.trim()) {
      setError(true);
    } else {
      createproductFaq(question, openSnackbar);
      setQuestion((prev) => ({ ...prev, faq_heading: "" }));
      setError(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 p-4">
      {/* Ask a Question Section */}
      <Box
        component="div"
        sx={{
          p: 3,
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: 1,
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <Typography variant="h6" className="text-lg font-semibold mb-2">
          Have a Question?
        </Typography>

        <TextField
          fullWidth
          label="Ask your question"
          multiline
          rows={3}
          value={question.faq_heading}
          onChange={(e) => {
            setQuestion((prev) => ({ ...prev, faq_heading: e.target.value }));
            setError(false);
          }}
          placeholder="Type your question here"
          required
          error={error}
          helperText={error ? "Question cannot be empty" : ""}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#d9d9d9",
              },
              "&:hover fieldset": {
                borderColor: "#a6a6a6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2a6c2b", // Amazon-like green when focused
              },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!question.faq_heading?.trim()}
          fullWidth
          sx={{
            backgroundColor: "#45b348",
            color: "#fff",
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#3a9d39",
            },
            py: 1.5,
            boxShadow: "none",
          }}
        >
          Submit Question
        </Button>
      </Box>

      {/* FAQ Section */}
      <div className="flex-1 space-y-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>  {/* Scrollable container */}
        {faqData?.length > 0 ? (
          faqData.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for better separation
                border: "1px solid #e0e0e0", // Light border around each FAQ
                borderRadius: "8px", // Rounded corners
                "&:before": {
                  display: "none", // Removes MUI default divider
                },
                transition: "all 0.3s ease", // Smooth transition on hover and expand
                "&.Mui-expanded": {
                  margin: "8px 0", // More margin between expanded FAQs
                },
                "&:hover": {
                  borderColor: "#2a6c2b", // Hover effect with green border
                },
              }}
            >
              <AccordionSummary
                expandIcon={<MdExpandMore />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  backgroundColor: "#f7f7f7", // Subtle background color for the question
                  padding: "12px 16px",
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(180deg)",
                  },
                }}
              >
                {/* Dynamic Serial Number and Question Heading */}
                <Typography className="font-semibold" sx={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
                  <span className="mr-2 text-gray-500">{index + 1}.</span> {faq.faq_heading}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: "#ffffff", // White background for the answer
                  padding: "16px", // More padding for better readability
                  borderTop: "1px solid #ddd", // Border between question and answer
                }}
              >
                <Typography variant="h6" className="mb-2" sx={{ color: "#2a6c2b" }}>
                  Answer:
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  {faq.faq_content}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <div className="text-gray-600">
            <Typography variant="body1">
              No FAQs found.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default Faq;
