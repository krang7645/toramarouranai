import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InitialScreen from './InitialScreen';
import QuestionScreen from './QuestionScreen';
import ResultScreen from './ResultScreen';
import DifyResultScreen from './DifyResultScreen';
import { calculateZodiacSign, getMBTIType, getTypeDescription } from '../utils/helpers';

const MBTITest = () => {
  // アプリケーションの状態
  const [step, setStep] = useState(1); // 1: 初期画面, 2: 診断画面, 3: 結果画面, 4: Dify結果画面
  const [birthdate, setBirthdate] = useState({
    year: new Date().getFullYear() - 20,
    month: 1,
    day: 1
  });
  const [gender, setGender] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  });
  const [mbtiType, setMbtiType] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [loading, setLoading] = useState(false);
  const [difyResponse, setDifyResponse] = useState(null);
  const navigate = useNavigate();

  // MBTI診断の質問
  const questions = [
    // E/I 軸の質問
    {
      text: "友達から「今から飲み会あるねんけど、来る？」って急に誘われた時、すぐに「行く！」って答えられる方やねん",
      dimension: "EI",
      direction: "E"
    },
    {
      text: "初めて行くお店でも、店員さんに気軽に話しかけられる方やわ",
      dimension: "EI",
      direction: "E"
    },
    {
      text: "休みの日は、家でゆっくりするより友達と出かける方が元気出るわ",
      dimension: "EI",
      direction: "E"
    },
    // S/N 軸の質問
    {
      text: "新しいプロジェクト始める時、細かい計画より、まずはアイデアを出すのが好きやねん",
      dimension: "SN",
      direction: "N"
    },
    {
      text: "本読む時、物語の細かい描写より、その背景にある意味を考える方が好きやわ",
      dimension: "SN",
      direction: "N"
    },
    {
      text: "料理する時、レシピ通りより、自分なりにアレンジする方が楽しいねん",
      dimension: "SN",
      direction: "N"
    },
    // T/F 軸の質問
    {
      text: "友達が悩み相談してきた時、解決策を提案するより、まず気持ちに寄り添う方やねん",
      dimension: "TF",
      direction: "F"
    },
    {
      text: "グループで意見が分かれた時、論理的な判断より、みんなの気持ちを大事にする方やわ",
      dimension: "TF",
      direction: "F"
    },
    {
      text: "仕事で失敗した人を評価する時、努力のプロセスより結果を重視してまうわ",
      dimension: "TF",
      direction: "T"
    },
    // J/P 軸の質問
    {
      text: "旅行行く時、スケジュールはびっしり決めてから行く方が安心やねん",
      dimension: "JP",
      direction: "J"
    },
    {
      text: "締め切り近い仕事でも、新しいアイデアが出てきたら試してみたくなるわ",
      dimension: "JP",
      direction: "P"
    },
    {
      text: "予定変更されると、ソワソワしてまうタイプやねん",
      dimension: "JP",
      direction: "J"
    },
    // 追加の質問
    {
      text: "会議の時、みんなの意見を聞いてからじゃないと、自分の考え言えへんわ",
      dimension: "EI",
      direction: "I"
    },
    {
      text: "何か決める時、経験や事実より、直感を信じる方やねん",
      dimension: "SN",
      direction: "N"
    },
    {
      text: "友達と待ち合わせる時、時間ピッタリに着くように計算してまうわ",
      dimension: "JP",
      direction: "J"
    }
  ];

  // 7段階評価の選択肢
  const answerOptions = [
    { value: 3, label: "めっちゃそうやわ" },
    { value: 2, label: "そうやな" },
    { value: 1, label: "どっちかと言うとそうやわ" },
    { value: 0, label: "どっちもちゃうなぁ" },
    { value: -1, label: "どっちかと言うと違うわ" },
    { value: -2, label: "違うかな" },
    { value: -3, label: "めっちゃ違うわ" }
  ];

  // 診断スタートボタンのハンドラ
  const handleStartDiagnosis = () => {
    if (!gender) {
      alert('性別を選択してください');
      return;
    }

    const calculatedZodiac = calculateZodiacSign(birthdate.month, birthdate.day);
    setZodiacSign(calculatedZodiac);
    setStep(2);
  };

  // 質問への回答ハンドラ
  const handleAnswer = (score) => {
    const question = questions[currentQuestion];
    const { dimension, direction } = question;

    const newScores = { ...scores };
    if (direction === dimension[0]) {
      newScores[dimension[0]] += score;
    } else {
      newScores[dimension[1]] += score;
    }

    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 診断完了
      const type = getMBTIType(newScores);
      setMbtiType(type);
      setStep(3);
    }
  };

  // Difyへのデータ送信とレスポンス取得
  const sendToDify = async () => {
    setDifyResponse(null);
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const apiUrl = process.env.REACT_APP_DIFY_API_URL;
      const apiKey = process.env.REACT_APP_DIFY_API_KEY;

      if (!apiUrl || !apiKey) {
        throw new Error('Dify APIの設定が見つかりません。環境変数を確認してください。');
      }

      const requestBody = {
        inputs: {
          zodiac: zodiacSign,
          mbti: mbtiType,
          gender: gender
        },
        response_mode: "blocking",
        conversation_id: "",
        user: "user"
      };

      console.log('Dify APIリクエスト送信中...');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dify APIエラー:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`APIエラー (${response.status}): ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dify APIレスポンス:', data);

      if (!data || !data.data || !data.data.outputs || !data.data.outputs.text) {
        throw new Error('APIレスポンスの形式が不正です');
      }

      setDifyResponse(data);
      setLoading(false);
      setStep(4);

    } catch (error) {
      console.error('Dify APIエラー:', error);
      setLoading(false);
      alert(`エラーが発生しました: ${error.message}\n\n再度お試しください。`);
      setStep(3);
    }
  };

  // レスポンスデータが有効かどうかを確認する関数
  const hasValidContent = (data) => {
    // データがオブジェクトでない場合は無効
    if (!data || typeof data !== 'object') {
      console.log('hasValidContent: データがオブジェクトではありません');
      return false;
    }

    // 各カテゴリの少なくとも1つに意味のあるコンテンツがあればOK
    const categories = ['恋愛', '仕事', '健康', 'お金'];

    // 各カテゴリのチェックとデバッグログ
    const validCategories = categories.filter(category => {
      const content = data[category];
      const isValid = content &&
                      typeof content === 'string' &&
                      content.trim().length > 5; // 最小限の長さを5文字に緩和

      console.log(`カテゴリ「${category}」の内容: ${isValid ? '有効' : '無効'} (${content ? content.length : 0}文字)`);
      return isValid;
    });

    // 有効なカテゴリが1つ以上あればデータは有効と判断
    const isValid = validCategories.length > 0;
    console.log(`有効なカテゴリ数: ${validCategories.length}`);
    return isValid;
  };

  // テストをリセットする
  const resetTest = () => {
    // 完全にステートをリセット
    setStep(1);
    setCurrentQuestion(0);
    setScores({
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    });
    setMbtiType('');
    setZodiacSign('');
    setLoading(false);
    setDifyResponse(null);
    setBirthdate({
      year: new Date().getFullYear() - 20,
      month: 1,
      day: 1
    });
    setGender('');
  };

  // 結果画面への遷移
  const goToResults = () => {
    if (difyResponse) {
      navigate('/result', {
        state: {
          difyResponse,
          mbtiType,
          zodiacSign,
          gender
        }
      });
    }
  };

  // step 4の場合（結果表示）
  useEffect(() => {
    if (step === 4 && difyResponse) {
      goToResults();
    }
  }, [step, difyResponse]);

  // 各ステップに基づいて表示するコンポーネントを切り替え
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <InitialScreen
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            gender={gender}
            setGender={setGender}
            onStartDiagnosis={handleStartDiagnosis}
          />
        );

      case 2:
        return (
          <QuestionScreen
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        );

      case 3:
        return (
          <ResultScreen
            zodiacSign={zodiacSign}
            mbtiType={mbtiType}
            typeDescription={getTypeDescription(mbtiType)}
            scores={scores}
            loading={loading}
            onSendToDify={sendToDify}
            onReset={resetTest}
            birthday={birthdate}
          />
        );

      case 4:
        return (
          <DifyResultScreen
            zodiacSign={zodiacSign}
            mbtiType={mbtiType}
            gender={gender}
            difyResponse={difyResponse}
            onReset={resetTest}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center">
      {renderStep()}
    </div>
  );
};

export default MBTITest;