import pandas as pd

all_columns = ['prior_signs_mental_health_issues', 'weapons_obtained_legally',
       'summary', 'weapon', 'weapon_details', 'where_obtained', 'Case', 'Date',
       'Age', 'Fatalities', 'Gender', 'Injuries', 'Latitude', 'Location',
       'Location Type', 'Longitude', 'Race', 'Total Victims', 'Type', 'Year',
       'mental_health_details']

export_columns = ['Year', 'Gender', 'Age', 'Race', 'Total Victims']


def main():
    dataset = pd.read_csv('nullcleaned.csv')
    print(len(dataset))
    print(len(pd.read_csv('MassShootingsDatabase_1982_2022_postoncanvas.csv')))
    
    print()
    
        

    export = dataset[export_columns].copy() # strip columns    
    export = export.dropna()    # drop null
    export['Gender'] = export['Gender'].str.strip() # strip whitespace
    export['Race'] = export['Race'].str.strip() # strip whitespace
    export.to_csv('data.csv')


if __name__ == "__main__":
    main()
