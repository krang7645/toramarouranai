import React from 'react';
import { Box, Button, Container, LinearProgress, Typography, Card, CardContent, Grid } from '@mui/material';

const QuestionScreen = ({ currentQuestion, totalQuestions, question, onAnswer }) => {
  // 回答オプション
  const answerOptions = [
    { value: 2, label: '強くそう思う' },
    { value: 1, label: 'やや思う' },
    { value: 0, label: 'どちらでもない' },
    { value: -1, label: 'あまり思わない' },
    { value: -2, label: '全く思わない' }
  ];

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          質問 {currentQuestion + 1}/{totalQuestions}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={(currentQuestion / totalQuestions) * 100}
          sx={{ mb: 3, height: 10, borderRadius: 5 }}
        />

        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom align="center">
              {question.text}
            </Typography>
          </CardContent>
        </Card>

        <Grid container direction="column" spacing={2}>
          {answerOptions.map((option) => (
            <Grid item key={option.value}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => onAnswer(option.value)}
                sx={{
                  py: 1.5,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                {option.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default QuestionScreen;