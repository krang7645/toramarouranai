import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  LinearProgress,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';

const QuestionScreen = ({
  currentQuestion,
  totalQuestions,
  question,
  onAnswer
}) => {
  const answerOptions = [
    { value: -3, label: "めっちゃ違うわ" },
    { value: -2, label: "違うかな" },
    { value: -1, label: "どっちかと言うと違うわ" },
    { value: 0, label: "どっちもちゃうなぁ" },
    { value: 1, label: "どっちかと言うとそうやわ" },
    { value: 2, label: "そうやな" },
    { value: 3, label: "めっちゃそうやわ" }
  ];

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              質問 {currentQuestion + 1} / {totalQuestions}
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
          </Box>

          <Typography variant="h6" align="center" gutterBottom sx={{ mb: 4 }}>
            {question.text}
          </Typography>

          <RadioGroup
            aria-label="question"
            name="question"
            onChange={(e) => onAnswer(parseInt(e.target.value))}
            sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            {answerOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  m: 0,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              />
            ))}
          </RadioGroup>
        </Paper>
      </Box>
    </Container>
  );
};

export default QuestionScreen;