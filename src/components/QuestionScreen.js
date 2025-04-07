import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  LinearProgress,
  Grid
} from '@mui/material';

const QuestionScreen = ({
  currentQuestion,
  totalQuestions,
  question,
  onAnswer
}) => {
  const answerOptions = [
    { value: 3, label: "めっちゃそうやわ" },
    { value: 2, label: "そうやな" },
    { value: 1, label: "どっちかと言うとそうやわ" },
    { value: 0, label: "どっちもちゃうなぁ" },
    { value: -1, label: "どっちかと言うと違うわ" },
    { value: -2, label: "違うかな" },
    { value: -3, label: "めっちゃ違うわ" }
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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {answerOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onAnswer(option.value)}
                variant="outlined"
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  p: 2,
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: 'primary.main'
                  }
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default QuestionScreen;