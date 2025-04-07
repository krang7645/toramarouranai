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
  CardContent
} from '@mui/material';

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
    const maxPossibleScore = 9 * 3; // 各次元3問ずつ、最大スコアは3
    const normalizedScore1 = ((scores[dim1] + maxPossibleScore) / (maxPossibleScore * 2)) * 100;
    const normalizedScore2 = ((scores[dim2] + maxPossibleScore) / (maxPossibleScore * 2)) * 100;

    const total = normalizedScore1 + normalizedScore2;
    const percentage = (normalizedScore1 / total) * 100;

    return {
      dominant: percentage >= 50 ? dim1 : dim2,
      percentage: percentage >= 50 ? percentage : 100 - percentage
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <img
            src={process.env.PUBLIC_URL + "/toramaro-mbtiresult.png"}
            alt="トラまろMBTI診断結果"
            style={{
              width: '180px',
              height: '180px',
              objectFit: 'contain',
              marginBottom: '1rem',
              display: 'block'
            }}
          />
        </Box>

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

              const leftScore = index === 0 ? scores.E :
                              index === 1 ? scores.S :
                              index === 2 ? scores.T :
                              scores.J;

              const rightScore = index === 0 ? scores.I :
                               index === 1 ? scores.N :
                               index === 2 ? scores.F :
                               scores.P;

              return (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={2} sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.primary">
                            {labels[index].left}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Box sx={{
                            width: '100%',
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 4,
                            position: 'relative'
                          }}>
                            <Box sx={{
                              position: 'absolute',
                              left: `${dim.percentage}%`,
                              top: '-4px',
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              transform: 'translateX(-50%)'
                            }} />
                          </Box>
                        </Grid>
                        <Grid item xs={2} sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.primary">
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
            もう一度診断する
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResultScreen;