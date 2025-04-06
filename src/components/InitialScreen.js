import React from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper
} from '@mui/material';

const InitialScreen = ({ birthdate, setBirthdate, gender, setGender, onStartDiagnosis }) => {
  // 年月日の入力ハンドラ
  const handleBirthdateChange = (field, value) => {
    setBirthdate({
      ...birthdate,
      [field]: parseInt(value, 10) || 0
    });
  };

  // 性別選択ハンドラ
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  // 年の選択肢を生成
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let i = currentYear - 80; i <= currentYear - 18; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  // 月の選択肢を生成
  const generateMonthOptions = () => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  // 日の選択肢を生成
  const generateDayOptions = () => {
    const options = [];
    for (let i = 1; i <= 31; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <Container maxWidth="sm" sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(180deg, #2c1810 0%, #1a0f0a 100%)'
        }}
      >
        {/* ヘッダー部分 */}
        <Box sx={{
          p: 3,
          textAlign: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(180deg, #2c1810 0%, rgba(44, 24, 16, 0) 100%)',
            zIndex: 0
          }
        }}>
          <Box
            component="img"
            src={process.env.PUBLIC_URL + "/toramaro-header.png"}
            alt="トラまろ"
            sx={{
              width: '180px',
              height: '180px',
              marginBottom: 3,
              position: 'relative',
              zIndex: 1
            }}
          />
          <Typography variant="h5" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
            トラまろ　天命診断
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff', mb: 3, position: 'relative', zIndex: 1 }}>
            あなたのMBTIと星座で未来を占います
          </Typography>
        </Box>

        {/* フォーム部分 */}
        <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: '16px 16px 0 0' }}>
          <Typography variant="body1" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
            生年月日を選択してください
          </Typography>
          <Grid container spacing={1} justifyContent="center" sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                value={birthdate.year}
                onChange={(e) => handleBirthdateChange('year', e.target.value)}
                SelectProps={{ native: true }}
              >
                {generateYearOptions()}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                value={birthdate.month}
                onChange={(e) => handleBirthdateChange('month', e.target.value)}
                SelectProps={{ native: true }}
              >
                {generateMonthOptions()}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                value={birthdate.day}
                onChange={(e) => handleBirthdateChange('day', e.target.value)}
                SelectProps={{ native: true }}
              >
                {generateDayOptions()}
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="body1" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
            性別を選択してください
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              row
              name="gender"
              value={gender}
              onChange={handleGenderChange}
              sx={{ justifyContent: 'center', mb: 3 }}
            >
              <FormControlLabel value="男性" control={<Radio />} label="男性" />
              <FormControlLabel value="女性" control={<Radio />} label="女性" />
              <FormControlLabel value="その他" control={<Radio />} label="その他" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onStartDiagnosis}
              disabled={!gender}
              sx={{
                px: 4,
                py: 1,
                borderRadius: '25px',
                background: 'linear-gradient(45deg, #2c1810 30%, #1a0f0a 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1a0f0a 30%, #2c1810 90%)',
                }
              }}
            >
              診断スタート
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default InitialScreen;