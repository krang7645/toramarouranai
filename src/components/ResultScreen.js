import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const ResultScreen = ({
  zodiacSign,
  mbtiType,
  typeDescription,
  scores,
  loading,
  onSendToDify,
  onReset
}) => {
  // MBTIのディメンションを計算
  const calculateDimension = (dim1, dim2) => {
    const max = Math.max(scores[dim1], scores[dim2]);
    const percentage = Math.round((max / (scores[dim1] + scores[dim2])) * 100);
    return {
      dominant: scores[dim1] > scores[dim2] ? dim1 : dim2,
      percentage: isNaN(percentage) ? 50 : percentage
    };
  };

  const dimensions = [
    calculateDimension('E', 'I'),
    calculateDimension('S', 'N'),
    calculateDimension('T', 'F'),
    calculateDimension('J', 'P')
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
          <PetsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom>
          トラまろ　天命診断
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            あなたの性格タイプは: <strong>{mbtiType}</strong>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            星座: {zodiacSign}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" paragraph>
            {typeDescription}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {dimensions.map((dim, index) => {
              const labels = {
                0: { left: 'E（外向型）', right: 'I（内向型）' },
                1: { left: 'S（現実型）', right: 'N（直感型）' },
                2: { left: 'T（思考型）', right: 'F（感情型）' },
                3: { left: 'J（判断型）', right: 'P（知覚型）' },
              };

              const isLeft = dim.dominant === 'E' || dim.dominant === 'S' || dim.dominant === 'T' || dim.dominant === 'J';
              const percentage = isLeft ? dim.percentage : 100 - dim.percentage;

              return (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container alignItems="center">
                        <Grid item xs={3}>
                          <Typography variant="body2" color={isLeft ? 'primary' : 'text.secondary'}>
                            {labels[index].left}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ position: 'relative', height: 10, bgcolor: 'grey.200', borderRadius: 5 }}>
                            <Box
                              sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: `${percentage}%`,
                                bgcolor: isLeft ? 'primary.main' : 'secondary.main',
                                borderRadius: 5
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color={!isLeft ? 'secondary' : 'text.secondary'}>
                            {labels[index].right}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            トラまろに取説を作ってもらう
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            あなたのMBTIタイプと星座に基づいた、より詳細な洞察を得ることができます。
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={onSendToDify}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                分析中...
              </>
            ) : (
              '作成開始'
            )}
          </Button>

          <Button
            variant="outlined"
            onClick={onReset}
            disabled={loading}
          >
            やり直す
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResultScreen;